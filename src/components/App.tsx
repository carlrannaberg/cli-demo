import React, { useEffect } from 'react';
import { Box, useApp, useInput } from 'ink';
import { useUIStore } from '../stores/uiStore.js';
import { useConfigStore } from '../stores/configStore.js';
import { useTerminalResize } from '../utils/useTerminalResize.js';
import { errorLogger } from '../utils/errorLogger.js';
import IssueList from './IssueList.js';
import Dashboard from './Dashboard.js';
import { ExecutionView } from './ExecutionView.js';
import { ConfigView } from './ConfigView.js';
import StatusBar from './StatusBar.js';
import CommandPalette from './CommandPalette.js';
import Toast from './Toast.js';
import HelpModal from './HelpModal.js';

/**
 * Root application component that manages global state and routing.
 * 
 * @remarks
 * This component handles:
 * - View routing based on activeView state
 * - Global keyboard shortcuts
 * - Configuration loading on startup
 * - Rendering of overlay components (modals, toasts)
 * 
 * @example
 * ```tsx
 * // Entry point usage
 * import { render } from 'ink';
 * import App from './components/App';
 * 
 * render(<App />);
 * ```
 * 
 * @returns The root application component
 */
const App: React.FC = () => {
  const { activeView, setActiveView, toggleCommandPalette, toggleHelp, isCommandPaletteOpen, isHelpOpen } = useUIStore();
  const { loadConfig } = useConfigStore();
  const { exit } = useApp();
  useTerminalResize();
  
  // Load configuration on app start
  useEffect(() => {
    loadConfig();
  }, [loadConfig]);
  
  // Global keyboard shortcuts with error handling
  useInput((input, key) => {
    try {
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
    } catch (error) {
      errorLogger.logError(
        error instanceof Error ? error : new Error(String(error)),
        { context: 'keyboard_input', input, key }
      );
      
      // Don't show toast for keyboard errors to avoid UI disruption
      // Just log them silently
    }
  });
  
  
  return (
    <Box flexDirection="column" height="100%">
      {/* Main content area */}
      <Box flexGrow={1}>
        {activeView === 'issues' && <IssueList />}
        {activeView === 'overview' && <Dashboard />}
        {activeView === 'execution' && <ExecutionView />}
        {activeView === 'config' && <ConfigView />}
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