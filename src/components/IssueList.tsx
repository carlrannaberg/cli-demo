import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Text, useInput, Static } from 'ink';
import TextInput from 'ink-text-input';
import { useAgentStore } from '../stores/agentStore.js';
import { useUIStore } from '../stores/uiStore.js';
import { debounce } from '../utils/performance.js';

const IssueList: React.FC = () => {
  const [filter, setFilter] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { issues, executeIssue } = useAgentStore();
  const { showToast } = useUIStore();
  
  const filteredIssues = issues.filter(issue =>
    issue.title.toLowerCase().includes(filter.toLowerCase()) ||
    issue.description.toLowerCase().includes(filter.toLowerCase())
  );
  
  // Reset selection when filter changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [filter]);
  
  // Ensure selection stays within bounds
  useEffect(() => {
    if (selectedIndex >= filteredIssues.length && filteredIssues.length > 0) {
      setSelectedIndex(filteredIssues.length - 1);
    }
  }, [selectedIndex, filteredIssues.length]);
  
  useInput(async (_input, key) => {
    if (key.return && filteredIssues[selectedIndex]) {
      const issue = filteredIssues[selectedIndex];
      if (issue.status === 'completed') {
        showToast('Issue already completed', 'error');
      } else {
        showToast(`Executing issue: ${issue.title}`, 'info');
        await executeIssue(issue.id);
        showToast('Issue completed!', 'success');
      }
    }
    if (key.upArrow && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
    if (key.downArrow && selectedIndex < filteredIssues.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  });
  
  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold>Filter: </Text>
        <TextInput
          value={filter}
          onChange={setFilter}
          placeholder="Type to filter issues..."
        />
      </Box>
      
      <Box flexDirection="column" marginBottom={1}>
        {filteredIssues.length === 0 ? (
          <Text dimColor>No issues match the filter</Text>
        ) : (
          <Static items={filteredIssues}>
            {(issue, index) => (
              <Box key={issue.id}>
                <Text
                  color={selectedIndex === index ? 'blue' : undefined}
                  backgroundColor={selectedIndex === index ? 'white' : undefined}
                >
                  {selectedIndex === index ? '> ' : '  '}
                  {issue.status === 'completed' ? '✓' : '○'} #{issue.id} {issue.title}
                  <Text dimColor> - {issue.description}</Text>
                </Text>
              </Box>
            )}
          </Static>
        )}
      </Box>
      
      <Box>
        <Text dimColor>
          [↑↓] Navigate | [Enter] Execute | [Esc] Back
        </Text>
      </Box>
    </Box>
  );
};

export default IssueList;