import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { useAgentStore } from '../stores/agentStore.js';
import { useUIStore } from '../stores/uiStore.js';
import { useTheme } from '../hooks/useTheme.js';
import { figures } from '../constants/figures.js';

const IssueList: React.FC = () => {
  const [filter, setFilter] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFilterFocused, setIsFilterFocused] = useState(false);
  const { issues, executeIssue } = useAgentStore();
  const { showToast, setActiveView } = useUIStore();
  const theme = useTheme();
  
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
  
  useInput(async (input, key) => {
    // Toggle filter focus with '/'
    if (input === '/' && !isFilterFocused) {
      setIsFilterFocused(true);
      return;
    }
    
    // Exit filter mode with Escape
    if (key.escape) {
      if (isFilterFocused) {
        setIsFilterFocused(false);
      } else {
        setActiveView('overview');
      }
      return;
    }
    
    // Don't process other keys if filter is focused
    if (isFilterFocused) {
      return;
    }
    
    // List navigation
    if (key.upArrow) {
      if (key.ctrl || key.shift || key.meta) {
        // Jump to top with modifier key
        setSelectedIndex(0);
      } else if (selectedIndex > 0) {
        setSelectedIndex(selectedIndex - 1);
      }
    }
    if (key.downArrow) {
      if (key.ctrl || key.shift || key.meta) {
        // Jump to bottom with modifier key
        setSelectedIndex(filteredIssues.length - 1);
      } else if (selectedIndex < filteredIssues.length - 1) {
        setSelectedIndex(selectedIndex + 1);
      }
    }
    
    // Execute issue
    if (key.return && filteredIssues[selectedIndex]) {
      const issue = filteredIssues[selectedIndex];
      if (issue.status === 'completed') {
        showToast('Issue already completed', 'info', 2000);
      } else {
        showToast(`Executing: ${issue.title}`, 'info', 2000);
        try {
          await executeIssue(issue.id);
        } catch (error) {
          showToast(`Failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error', 3000);
        }
      }
    }
  });
  
  return (
    <Box flexDirection="column" padding={1}>
      {/* Header */}
      <Box 
        flexDirection="column"
        borderStyle="round"
        borderColor={theme.borderSecondary}
        padding={1}
        marginBottom={1}
      >
        <Text bold color={theme.primary}>
          {figures.bullet} Issues List
        </Text>
        
        <Box marginTop={1}>
          <Text color={theme.textSecondary}>Filter: </Text>
          {isFilterFocused ? (
            <TextInput
              value={filter}
              onChange={setFilter}
              placeholder="Type to filter..."
              onSubmit={() => setIsFilterFocused(false)}
            />
          ) : (
            <>
              <Text color={theme.textDim}>
                {filter || 'Press / to search'}
              </Text>
            </>
          )}
        </Box>
      </Box>
      
      {/* Issues */}
      <Box flexDirection="column" flexGrow={1}>
        {filteredIssues.length === 0 ? (
          <Box padding={1}>
            <Text color={theme.textDim}>
              No issues match your filter
            </Text>
          </Box>
        ) : (
          filteredIssues.map((issue, index) => {
            const isSelected = index === selectedIndex;
            const statusIcon = issue.status === 'completed' ? figures.success : 
                             issue.status === 'in-progress' ? figures.spinner[0] :
                             issue.status === 'failed' ? figures.error :
                             figures.bullet;
            const statusColor = issue.status === 'completed' ? theme.success :
                              issue.status === 'in-progress' ? theme.warning :
                              issue.status === 'failed' ? theme.error :
                              theme.textSecondary;
            
            return (
              <Box key={issue.id} marginY={0}>
                <Text color={isSelected ? theme.accent : theme.textDim}>
                  {isSelected ? figures.pointer : ' '}
                </Text>
                <Text color={statusColor}> {statusIcon} </Text>
                <Box flexDirection="column" flexGrow={1}>
                  <Text color={isSelected ? theme.text : theme.textSecondary}>
                    #{issue.id} {issue.title}
                  </Text>
                  {isSelected && (
                    <Box marginLeft={3}>
                      <Text color={theme.textDim}>
                        {issue.description}
                      </Text>
                    </Box>
                  )}
                </Box>
              </Box>
            );
          })
        )}
      </Box>
      
      {/* Help text */}
      <Box borderStyle="single" borderTop borderBottom={false} borderLeft={false} borderRight={false} paddingTop={1}>
        <Text color={theme.textDim}>
          {isFilterFocused ? (
            '[Enter] Done • [Esc] Cancel'
          ) : (
            '[↑↓] Navigate • [Ctrl+↑↓] Jump • [Enter] Execute • [/] Filter • [Esc] Back'
          )}
        </Text>
      </Box>
    </Box>
  );
};

export default IssueList;