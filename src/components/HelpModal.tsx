import React from 'react';
import { Box, Text, useInput } from 'ink';
import { useUIStore } from '../stores/uiStore.js';

const HelpModal: React.FC = () => {
  const { isHelpOpen, toggleHelp } = useUIStore();
  
  useInput((input, key) => {
    if (isHelpOpen && (key.escape || (key.ctrl && input === 'h'))) {
      toggleHelp();
    }
  });
  
  if (!isHelpOpen) {return null;}
  
  const shortcuts = [
    { keys: 'Ctrl+D', action: 'Navigate to Dashboard' },
    { keys: 'Ctrl+I', action: 'Navigate to Issues' },
    { keys: 'Ctrl+E', action: 'Navigate to Execution' },
    { keys: 'Ctrl+K', action: 'Open Command Palette' },
    { keys: 'Ctrl+H', action: 'Toggle Help' },
    { keys: 'Ctrl+C', action: 'Exit Application' },
    { keys: 'Escape', action: 'Close Modal/Go Back' },
    { keys: '↑↓', action: 'Navigate Lists' },
    { keys: 'Enter', action: 'Execute Selected' },
    { keys: 'Tab/Shift+Tab', action: 'Focus Navigation' },
  ];
  
  const errorRecovery = [
    { issue: 'Terminal too small', solution: 'Resize terminal to at least 60x10' },
    { issue: 'File access denied', solution: 'Check file permissions' },
    { issue: 'State corrupted', solution: 'Restart the application' },
    { issue: 'Execution failed', solution: 'Check logs and retry' },
  ];
  
  return (
    <Box
      width="100%"
      height="100%"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        borderStyle="round"
        borderColor="blue"
        padding={2}
        width={60}
        flexDirection="column"
      >
        <Text bold color="blue">
          ⚡ Keyboard Shortcuts
        </Text>
        <Box marginTop={1} />
        
        {shortcuts.map((shortcut, index) => (
          <Box key={shortcut.keys} marginBottom={index < shortcuts.length - 1 ? 1 : 0}>
            <Text color="cyan" bold>
              {shortcut.keys.padEnd(15)}
            </Text>
            <Text>{shortcut.action}</Text>
          </Box>
        ))}
        
        <Box marginTop={2}>
          <Text bold color="yellow">
            ⚠️  Error Recovery
          </Text>
        </Box>
        
        {errorRecovery.map((item) => (
          <Box key={item.issue} marginTop={1}>
            <Text color="red">
              {item.issue}:
            </Text>
            <Text> {item.solution}</Text>
          </Box>
        ))}
        
        <Box marginTop={2}>
          <Text dimColor italic>
            Press Escape or Ctrl+H to close
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default React.memo(HelpModal);