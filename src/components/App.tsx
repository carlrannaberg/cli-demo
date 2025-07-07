import React from 'react';
import { Box, Text, useApp, useInput } from 'ink';
import { useUIStore } from '../stores/uiStore.js';
import IssueList from './IssueList.js';

const App: React.FC = () => {
  const { activeView, setActiveView, toast, hideToast } = useUIStore();
  const { exit } = useApp();
  
  // Global keyboard shortcuts
  useInput((input, key) => {
    // Ctrl+C to exit
    if (key.ctrl && input === 'c') {
      exit();
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
  
  // Auto-hide toast after duration
  React.useEffect(() => {
    if (toast && toast.duration) {
      // Note: In a real implementation, the UI component displaying the toast
      // would handle the auto-hide behavior after the specified duration
      // For now, we'll rely on the component to manually hide it
    }
  }, [toast, hideToast]);
  
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
        {activeView === 'execution' && (
          <Box flexDirection="column" padding={1}>
            <Text>Execution View (Not implemented yet)</Text>
          </Box>
        )}
      </Box>
      
      {/* Toast notifications */}
      {toast && (
        <Box
          paddingX={1}
          borderStyle="round"
          borderColor={
            toast.type === 'success' ? 'green' :
            toast.type === 'error' ? 'red' :
            toast.type === 'warning' ? 'yellow' : 'blue'
          }
        >
          <Text color={
            toast.type === 'success' ? 'green' :
            toast.type === 'error' ? 'red' :
            toast.type === 'warning' ? 'yellow' : 'blue'
          }>
            {toast.message}
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default App;