import React from 'react';
import { Box, Text, useInput } from 'ink';
import { useAgentStore } from '../stores/agentStore.js';
import { useUIStore } from '../stores/uiStore.js';
import { useTheme } from '../hooks/useTheme.js';
import { figures } from '../constants/figures.js';
import { Logo } from './Logo.js';

/**
 * Dashboard component that provides an overview of the application state.
 * 
 * @remarks
 * Features:
 * - Displays issue statistics (total, completed, in-progress, pending)
 * - Tab navigation between different sections
 * - Quick access to other views
 * - Real-time status updates from agent store
 * 
 * Keyboard shortcuts:
 * - Tab/Shift+Tab: Navigate between sections
 * - Enter: Activate selected section
 * 
 * @returns Dashboard component with statistics and navigation
 */
const Dashboard: React.FC = () => {
  const { issues } = useAgentStore();
  const { setActiveView } = useUIStore();
  const theme = useTheme();
  
  // Calculate stats
  const totalIssues = issues.length;
  const completedIssues = issues.filter(i => i.status === 'completed').length;
  const inProgressIssues = issues.filter(i => i.status === 'in-progress').length;
  const pendingIssues = issues.filter(i => i.status === 'pending').length;
  const failedIssues = issues.filter(i => i.status === 'failed').length;
  
  // Tab navigation
  const sections = ['issues', 'execution', 'config'] as const;
  const [selectedSection, setSelectedSection] = React.useState(0);
  
  useInput((_input, key) => {
    if (key.downArrow) {
      setSelectedSection((prev) => (prev + 1) % sections.length);
    }
    if (key.upArrow) {
      setSelectedSection((prev) => (prev - 1 + sections.length) % sections.length);
    }
    if (key.return) {
      setActiveView(sections[selectedSection]);
    }
  });
  
  return (
    <Box flexDirection="column" padding={1}>
      <Logo />
      
      {/* Statistics */}
      <Box 
        flexDirection="column" 
        marginBottom={2}
        borderStyle="round"
        borderColor={theme.borderSecondary}
        padding={1}
      >
        <Text bold color={theme.primary}>
          {figures.package} Project Overview
        </Text>
        
        <Box marginTop={1} flexDirection="row" gap={3}>
          <Box flexDirection="column">
            <Text color={theme.textSecondary}>Total</Text>
            <Text bold>{totalIssues}</Text>
          </Box>
          
          <Box flexDirection="column">
            <Text color={theme.success}>Completed</Text>
            <Text bold color={theme.success}>{completedIssues}</Text>
          </Box>
          
          <Box flexDirection="column">
            <Text color={theme.warning}>In Progress</Text>
            <Text bold color={theme.warning}>{inProgressIssues}</Text>
          </Box>
          
          <Box flexDirection="column">
            <Text color={theme.info}>Pending</Text>
            <Text bold color={theme.info}>{pendingIssues}</Text>
          </Box>
          
          {failedIssues > 0 && (
            <Box flexDirection="column">
              <Text color={theme.error}>Failed</Text>
              <Text bold color={theme.error}>{failedIssues}</Text>
            </Box>
          )}
        </Box>
        
        {/* Progress Bar */}
        <Box marginTop={1}>
          <Box>
            {(() => {
              const progress = Math.floor((completedIssues / totalIssues) * 20);
              const progressBar = Array(20).fill(null).map((_, i) => i < progress ? figures.progressFull : figures.progressEmpty).join('');
              return (
                <>
                  <Text color={theme.success}>{progressBar.slice(0, progress)}</Text>
                  <Text color={theme.textDim}>{progressBar.slice(progress)}</Text>
                  <Text color={theme.textSecondary}> {Math.floor((completedIssues / totalIssues) * 100)}%</Text>
                </>
              );
            })()}
          </Box>
        </Box>
      </Box>
      
      {/* Quick Actions */}
      <Box 
        flexDirection="column"
        borderStyle="round"
        borderColor={theme.borderSecondary}
        padding={1}
        marginBottom={1}
      >
        <Text bold color={theme.primary}>
          {figures.lightning} Quick Actions
        </Text>
        
        <Box marginTop={1} flexDirection="column">
          <Box>
            <Text color={selectedSection === 0 ? theme.accent : theme.text}>
              {selectedSection === 0 ? figures.pointer : ' '} View Issues
            </Text>
            <Text dimColor> (Ctrl+I)</Text>
          </Box>
          
          <Box>
            <Text color={selectedSection === 1 ? theme.accent : theme.text}>
              {selectedSection === 1 ? figures.pointer : ' '} View Execution
            </Text>
            <Text dimColor> (Ctrl+E)</Text>
          </Box>
          
          <Box>
            <Text color={selectedSection === 2 ? theme.accent : theme.text}>
              {selectedSection === 2 ? figures.pointer : ' '} Configuration
            </Text>
            <Text dimColor> (Ctrl+G)</Text>
          </Box>
        </Box>
      </Box>
      
      {/* Help text */}
      <Box>
        <Text color={theme.textDim}>
          [↑↓] Navigate {figures.bullet} [Enter] Select {figures.bullet} [Ctrl+H] Help
        </Text>
      </Box>
    </Box>
  );
};

export default Dashboard;