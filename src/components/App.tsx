import React from 'react';
import { Box, Text, useApp, useInput } from 'ink';
import { useUIStore } from '../stores/uiStore.js';
import IssueList from './IssueList.js';
import { ExecutionView } from './ExecutionView.js';
import StatusBar from './StatusBar.js';
import CommandPalette from './CommandPalette.js';
import Toast from './Toast.js';

const App: React.FC = () => {
  const { activeView, setActiveView, toggleCommandPalette } = useUIStore();
  const { exit } = useApp();
  
  // Global keyboard shortcuts
  useInput((input, key) => {
    // Ctrl+C to exit
    if (key.ctrl && input === 'c') {
      exit();
    }
    
    // Ctrl+K to toggle command palette
    if (key.ctrl && input === 'k') {
      toggleCommandPalette();
    }
    
    // View navigation shortcuts
    if (key.ctrl && input === 'i') {
      setActiveView('issues');
    }
    if (key.ctrl && input === 'd') {
      setActiveView('overview');
    }
    if (key.ctrl && input === 'e') {
      setActiveView('execution');
    }
    
    // Escape to go back to overview
    if (key.escape) {
      setActiveView('overview');
    }
  });
  
  
  return (
    <Box flexDirection="column" height="100%">
      {/* Main content area */}
      <Box flexGrow={1}>
        {activeView === 'issues' && <IssueList />}
        {activeView === 'overview' && (
          <Box flexDirection="column" padding={1}>
            <Text color="green" bold>
              🚀 CLI Demo - Interactive Terminal UI
            </Text>
            <Text>
              Press Ctrl+I to view issues
            </Text>
          </Box>
        )}
        {activeView === 'execution' && <ExecutionView />}
      </Box>
      
      {/* Toast notifications */}
      <Toast />
      
      {/* Status bar at the bottom */}
      <StatusBar />
      
      {/* Command Palette overlay */}
      <CommandPalette />
    </Box>
  );
};

export default App;