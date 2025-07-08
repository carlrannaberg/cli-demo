import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { useUIStore } from '../stores/uiStore.js';
import { useAgentStore } from '../stores/agentStore.js';
import { useTheme } from '../hooks/useTheme.js';
import { figures } from '../constants/figures.js';
import { showErrorToast } from '../utils/errorToast.js';
import { errorLogger } from '../utils/errorLogger.js';

interface Command {
  label: string;
  value: string;
  icon: string;
  description?: string;
}

const CommandPalette: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { isCommandPaletteOpen, toggleCommandPalette, setActiveView, toggleHelp } = useUIStore();
  const theme = useTheme();
  
  const commands: Command[] = [
    { label: 'Go to Dashboard', value: 'dashboard', icon: figures.package, description: 'View project overview' },
    { label: 'Go to Issues', value: 'issues', icon: figures.bullet, description: 'Browse and manage issues' },
    { label: 'Go to Execution', value: 'execution', icon: figures.lightning, description: 'Monitor execution progress' },
    { label: 'Go to Configuration', value: 'config', icon: figures.gear, description: 'Manage settings' },
    { label: 'Run All Issues', value: 'run-all', icon: figures.rocket, description: 'Execute all pending issues' },
    { label: 'Show Help', value: 'help', icon: figures.info, description: 'Display keyboard shortcuts' },
    { label: 'View Error Logs', value: 'view-logs', icon: figures.warning, description: 'Open error log location' },
    { label: 'Clear Error History', value: 'clear-errors', icon: figures.error, description: 'Remove all error logs' }
  ];
  
  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    (cmd.description && cmd.description.toLowerCase().includes(query.toLowerCase()))
  );
  
  // Reset selected index when query changes
  React.useEffect(() => {
    setSelectedIndex(0);
  }, [query]);
  
  const handleSelect = async (item: Command) => {
    toggleCommandPalette();
    setQuery('');
    setSelectedIndex(0);
    
    try {
      switch (item.value) {
        case 'dashboard':
          setActiveView('overview');
          break;
        case 'issues':
          setActiveView('issues');
          break;
        case 'execution':
          setActiveView('execution');
          break;
        case 'config':
          setActiveView('config');
          break;
        case 'run-all':
          await useAgentStore.getState().executeAll();
          break;
        case 'help':
          toggleHelp();
          break;
        case 'view-logs': {
          const logPath = errorLogger.getLogFilePath();
          useUIStore.getState().showToast(
            `Error logs at: ${logPath}`,
            'info',
            5000
          );
          break;
        }
        case 'clear-errors':
          await errorLogger.logInfo('Error history cleared by user');
          useUIStore.getState().showToast(
            'Error history cleared',
            'success',
            3000
          );
          break;
      }
    } catch (error) {
      await showErrorToast(error, {
        title: 'Command failed',
        showRecovery: true
      });
    }
  };
  
  useInput((_input, key) => {
    if (key.escape) {
      toggleCommandPalette();
      setQuery('');
      setSelectedIndex(0);
    } else if (key.upArrow) {
      setSelectedIndex((prev) => Math.max(0, prev - 1));
    } else if (key.downArrow) {
      setSelectedIndex((prev) => Math.min(filteredCommands.length - 1, prev + 1));
    } else if (key.return && filteredCommands.length > 0) {
      handleSelect(filteredCommands[selectedIndex]);
    }
  }, { isActive: isCommandPaletteOpen });
  
  if (!isCommandPaletteOpen) {
    return null;
  }
  
  return (
    <Box
      position="absolute"
      width="100%"
      height="100%"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        width={70}
        flexDirection="column"
        borderStyle="round"
        borderColor={theme.borderPrimary}
        padding={1}
      >
        <Box marginBottom={1}>
          <Text color={theme.primary} bold>
            {figures.lightning} Command Palette
          </Text>
        </Box>
        
        <Box marginBottom={1}>
          <Text color={theme.textSecondary}>{figures.normalPrompt} </Text>
          <TextInput
            value={query}
            onChange={setQuery}
            placeholder="Type to search commands..."
            focus
          />
        </Box>
        
        {filteredCommands.length > 0 ? (
          <Box flexDirection="column">
            {filteredCommands.map((cmd, i) => {
              const isSelected = i === selectedIndex;
              
              return (
                <Box key={cmd.value}>
                  <Text color={isSelected ? theme.accent : theme.textDim}>
                    {isSelected ? figures.pointer : ' '} 
                  </Text>
                  <Text color={theme.accent}>{cmd.icon} </Text>
                  <Text color={isSelected ? theme.text : theme.textSecondary}>
                    {cmd.label}
                  </Text>
                  {cmd.description && (
                    <Text color={theme.textDim}> - {cmd.description}</Text>
                  )}
                </Box>
              );
            })}
          </Box>
        ) : (
          <Box padding={1}>
            <Text color={theme.textDim}>
              No commands match &ldquo;{query}&rdquo;
            </Text>
          </Box>
        )}
        
        <Box marginTop={1}>
          <Text color={theme.textDim}>
            [↑↓] Navigate {figures.bullet} [Enter] Select {figures.bullet} [Esc] Cancel
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default CommandPalette;