import React from 'react';
import { Box, Text, Spacer } from 'ink';
import { useUIStore } from '../stores/uiStore.js';
import { useAgentStore } from '../stores/agentStore.js';

const StatusBar: React.FC = () => {
  const { activeView } = useUIStore();
  const { projectStatus } = useAgentStore();
  
  // Map view names to display names
  const viewDisplayName = {
    overview: 'Dashboard',
    issues: 'Issues',
    execution: 'Execution',
    logs: 'Logs'
  };
  
  return (
    <Box
      borderStyle="single"
      borderTop
      borderBottom={false}
      borderLeft={false}
      borderRight={false}
      paddingX={1}
      flexDirection="row"
      alignItems="center"
    >
      {/* Current View */}
      <Box marginRight={2}>
        <Text color="cyan" bold>
          {viewDisplayName[activeView]}
        </Text>
      </Box>
      
      {/* Separator */}
      <Text dimColor>|</Text>
      
      {/* Project Statistics */}
      <Box marginX={2}>
        <Text>
          <Text color="green">{projectStatus.completedIssues}</Text>
          <Text dimColor>/</Text>
          <Text>{projectStatus.totalIssues}</Text>
          <Text dimColor> issues</Text>
        </Text>
      </Box>
      
      <Spacer />
      
      {/* Keyboard Shortcuts */}
      <Box>
        <Text dimColor>
          {activeView === 'issues' && (
            <>
              <Text>↑↓</Text>
              <Text dimColor>: Nav </Text>
              <Text dimColor>| </Text>
              <Text>Enter</Text>
              <Text dimColor>: Execute </Text>
              <Text dimColor>| </Text>
            </>
          )}
          {activeView === 'overview' && (
            <>
              <Text>Tab</Text>
              <Text dimColor>: Focus </Text>
              <Text dimColor>| </Text>
            </>
          )}
          <Text>Ctrl+K</Text>
          <Text dimColor>: Cmd </Text>
          <Text dimColor>| </Text>
          <Text>Ctrl+H</Text>
          <Text dimColor>: Help </Text>
          <Text dimColor>| </Text>
          <Text>Ctrl+C</Text>
          <Text dimColor>: Exit</Text>
        </Text>
      </Box>
    </Box>
  );
};

export default StatusBar;