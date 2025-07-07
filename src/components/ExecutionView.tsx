import React from 'react';
import { Box, Text, Spacer, Static } from 'ink';
import Spinner from 'ink-spinner';
import { useAgentStore } from '../stores/agentStore.js';

export const ExecutionView: React.FC = () => {
  const { execution, output, issues } = useAgentStore();
  const currentIssue = execution.currentIssueId 
    ? issues.find(i => i.id === execution.currentIssueId)
    : null;
  
  return (
    <Box flexDirection="column" padding={1} height="100%">
      <Box borderStyle="round" borderColor="cyan" paddingX={1} marginBottom={1}>
        <Text bold>Execution Monitor</Text>
        <Spacer />
        {execution.isRunning && <Spinner type="dots" />}
        <Text> Claude</Text>
      </Box>
      
      {currentIssue ? (
        <Box marginBottom={1}>
          <Text>Issue: </Text>
          <Text color="yellow">#{currentIssue.id} {currentIssue.title}</Text>
          <Spacer />
          <Text dimColor>{execution.progress}%</Text>
        </Box>
      ) : (
        <Box marginBottom={1}>
          <Text dimColor>No issue currently executing</Text>
        </Box>
      )}
      
      <Box flexDirection="column" borderStyle="single" borderColor="gray" padding={1} height={15}>
        {output.length > 0 ? (
          <Static items={output}>
            {(line, i) => (
              <Text key={i} color={line.includes('✅') || line.includes('✓') || line.includes('success') ? 'green' : undefined}>
                {line}
              </Text>
            )}
          </Static>
        ) : (
          <Text dimColor>No output yet...</Text>
        )}
      </Box>
    </Box>
  );
};