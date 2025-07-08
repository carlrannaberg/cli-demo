import React from 'react';
import { Box, Text } from 'ink';
import { figures } from '../constants/figures.js';
import { useTheme } from '../hooks/useTheme.js';

export const Logo: React.FC = () => {
  const theme = useTheme();
  
  const asciiArt = [
    '   _____ _      _____   _____  ______ __  __  ____  ',
    '  / ____| |    |_   _| |  __ \\|  ____|  \\/  |/ __ \\ ',
    ' | |    | |      | |   | |  | | |__  | \\  / | |  | |',
    ' | |    | |      | |   | |  | |  __| | |\\/| | |  | |',
    ' | |____| |____ _| |_  | |__| | |____| |  | | |__| |',
    '  \\_____|______|_____| |_____/|______|_|  |_|\\____/ '
  ];
  
  return (
    <Box 
      borderStyle="round" 
      borderColor={theme.borderPrimary}
      paddingX={2}
      paddingY={1}
      flexDirection="column"
      alignItems="center"
      marginBottom={1}
    >
      <Box flexDirection="column" alignItems="center">
        {asciiArt.map((line) => (
          <Text key={line} color={theme.primary}>{line}</Text>
        ))}
      </Box>
      
      <Box marginTop={1} flexDirection="column" alignItems="center">
        <Box>
          <Text color={theme.accent}>{figures.sparkle} </Text>
          <Text bold>Interactive Terminal UI Demo</Text>
          <Text color={theme.accent}> {figures.sparkle}</Text>
        </Box>
        <Text dimColor>
          Built with {figures.logo} Ink, React, and Zustand
        </Text>
      </Box>
    </Box>
  );
};