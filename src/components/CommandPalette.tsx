import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import SelectInput from 'ink-select-input';
import { useUIStore } from '../stores/uiStore.js';
import { useAgentStore } from '../stores/agentStore.js';

const CommandPalette: React.FC = () => {
  const [query, setQuery] = useState('');
  const { isCommandPaletteOpen, toggleCommandPalette, setActiveView, toggleHelp } = useUIStore();
  
  useInput((_input, key) => {
    if (isCommandPaletteOpen && key.escape) {
      toggleCommandPalette();
      setQuery('');
    }
  });
  
  if (!isCommandPaletteOpen) return null;
  
  const commands = [
    { label: 'Go to Dashboard', value: 'dashboard' },
    { label: 'Go to Issues', value: 'issues' },
    { label: 'Go to Execution', value: 'execution' },
    { label: 'Run All Issues', value: 'run-all' },
    { label: 'Show Help', value: 'help' }
  ];
  
  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );
  
  const handleSelect = async (item: { value: string }) => {
    toggleCommandPalette();
    setQuery('');
    
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
      case 'run-all':
        await useAgentStore.getState().executeAll();
        break;
      case 'help':
        toggleHelp();
        break;
    }
  };
  
  return (
    <Box
      position="absolute"
      width={60}
      marginTop={2}
      flexDirection="column"
      borderStyle="round"
      borderColor="magenta"
      padding={1}
    >
      <Box marginBottom={1}>
        <Text>Command: </Text>
        <TextInput
          value={query}
          onChange={setQuery}
          placeholder="Type to search..."
          focus
        />
      </Box>
      {filteredCommands.length > 0 ? (
        <SelectInput items={filteredCommands} onSelect={handleSelect} />
      ) : (
        <Text dimColor>No commands found</Text>
      )}
    </Box>
  );
};

export default CommandPalette;