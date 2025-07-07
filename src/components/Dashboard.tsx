import React from 'react';
import { Box, Text, useInput } from 'ink';
import { useAgentStore } from '../stores/agentStore.js';
import { useUIStore } from '../stores/uiStore.js';

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
  
  // Calculate stats
  const totalIssues = issues.length;
  const completedIssues = issues.filter(i => i.status === 'completed').length;
  const inProgressIssues = issues.filter(i => i.status === 'in-progress').length;
  const pendingIssues = issues.filter(i => i.status === 'pending').length;
  
  // Tab navigation
  const sections = ['issues', 'execution', 'config'] as const;
  const [selectedSection, setSelectedSection] = React.useState(0);
  
  useInput((_input, key) => {
    if (key.tab && !key.shift) {
      setSelectedSection((prev) => (prev + 1) % sections.length);
    }
    if (key.tab && key.shift) {
      setSelectedSection((prev) => (prev - 1 + sections.length) % sections.length);
    }
    if (key.return) {
      setActiveView(sections[selectedSection]);
    }
  });
  
  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={2}>
        <Text color="green" bold>
          🚀 CLI Demo - Interactive Terminal UI
        </Text>
      </Box>
      
      <Box flexDirection="column" marginBottom={2}>
        <Text bold underline>
          📊 Overview
        </Text>
        <Box marginTop={1} flexDirection="column">
          <Text>Total Issues: {totalIssues}</Text>
          <Text color="green">✓ Completed: {completedIssues}</Text>
          <Text color="yellow">⚡ In Progress: {inProgressIssues}</Text>
          <Text color="cyan">○ Pending: {pendingIssues}</Text>
        </Box>
      </Box>
      
      <Box flexDirection="column" marginBottom={2}>
        <Text bold underline>
          🎯 Quick Actions
        </Text>
        <Box marginTop={1} flexDirection="column">
          <Box>
            <Text color={selectedSection === 0 ? 'blue' : undefined}>
              {selectedSection === 0 ? '> ' : '  '}
              View Issues (Ctrl+I)
            </Text>
          </Box>
          <Box>
            <Text color={selectedSection === 1 ? 'blue' : undefined}>
              {selectedSection === 1 ? '> ' : '  '}
              View Execution (Ctrl+E)
            </Text>
          </Box>
          <Box>
            <Text color={selectedSection === 2 ? 'blue' : undefined}>
              {selectedSection === 2 ? '> ' : '  '}
              Configuration Settings
            </Text>
          </Box>
        </Box>
      </Box>
      
      <Box>
        <Text dimColor>
          [Tab/Shift+Tab] Navigate | [Enter] Select | [Ctrl+H] Help
        </Text>
      </Box>
    </Box>
  );
};

export default Dashboard;