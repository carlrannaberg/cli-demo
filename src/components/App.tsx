import React from 'react';
import { Box, useApp, useInput } from 'ink';
import { useUIStore } from '../stores/uiStore.js';
import IssueList from './IssueList.js';
import Dashboard from './Dashboard.js';
import { ExecutionView } from './ExecutionView.js';
import StatusBar from './StatusBar.js';
import CommandPalette from './CommandPalette.js';
import Toast from './Toast.js';
import HelpModal from './HelpModal.js';

const App: React.FC = () => {
  const { activeView, setActiveView, toggleCommandPalette, toggleHelp, isCommandPaletteOpen, isHelpOpen } = useUIStore();
  const { exit } = useApp();
  
  // Global keyboard shortcuts
  useInput((input, key) => {
    // Don't process global shortcuts if modals are open
    const modalOpen = isCommandPaletteOpen || isHelpOpen;
    
    // Ctrl+C to exit (always active)
    if (key.ctrl && input === 'c') {
      exit();
    }
    
    // Ctrl+H to toggle help
    if (key.ctrl && input === 'h') {
      toggleHelp();
    }
    
    // Ctrl+K to toggle command palette
    if (key.ctrl && input === 'k' && !isHelpOpen) {
      toggleCommandPalette();
    }
    
    // View navigation shortcuts (only when no modals are open)
    if (!modalOpen) {
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
      if (key.escape && activeView !== 'overview') {
        setActiveView('overview');
      }
    }
  });
  
  
  return (
    <Box flexDirection="column" height="100%">
      {/* Main content area */}
      <Box flexGrow={1}>
        {activeView === 'issues' && <IssueList />}
        {activeView === 'overview' && <Dashboard />}
        {activeView === 'execution' && <ExecutionView />}
      </Box>
      
      {/* Toast notifications */}
      <Toast />
      
      {/* Status bar at the bottom */}
      <StatusBar />
      
      {/* Command Palette overlay */}
      <CommandPalette />
      
      {/* Help Modal overlay */}
      <HelpModal />
    </Box>
  );
};

export default App;