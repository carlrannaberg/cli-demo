import React, { useEffect, useRef } from 'react';
import { Box, Text, Spacer } from 'ink';
import { useUIStore } from '../stores/uiStore.js';
import { useAgentStore } from '../stores/agentStore.js';
import { useConfigStore } from '../stores/configStore.js';
import { useTheme } from '../hooks/useTheme.js';
import { figures } from '../constants/figures.js';
import { Toast as ToastType } from '../types/index.js';

const StatusBar: React.FC = () => {
  const { activeView, toasts, hideToast } = useUIStore();
  const { projectStatus, execution } = useAgentStore();
  const { config } = useConfigStore();
  const theme = useTheme();
  
  // Map view names to display names with icons
  const viewInfo = {
    overview: { name: 'Dashboard', icon: figures.package },
    issues: { name: 'Issues', icon: figures.bullet },
    execution: { name: 'Execution', icon: figures.lightning },
    logs: { name: 'Logs', icon: figures.gear },
    config: { name: 'Configuration', icon: figures.gear },
    repl: { name: 'REPL', icon: figures.pointer }
  };
  
  const currentView = viewInfo[activeView] || { name: activeView, icon: figures.bullet };
  
  // Toast component for inline display
  const ToastItem: React.FC<{ toast: ToastType }> = ({ toast }) => {
    const timerRef = useRef<ReturnType<typeof setTimeout>>();
    
    useEffect(() => {
      if (toast.duration) {
        timerRef.current = setTimeout(() => {
          hideToast(toast.id);
        }, toast.duration);
        
        return () => {
          if (timerRef.current) {
            clearTimeout(timerRef.current);
          }
        };
      }
      return undefined;
    }, [toast.id, toast.duration]);
    
    const toastConfig = {
      success: { color: theme.success, icon: figures.success },
      error: { color: theme.error, icon: figures.error },
      info: { color: theme.info, icon: figures.info },
      warning: { color: theme.warning, icon: figures.warning }
    };
    
    const config = toastConfig[toast.type];
    
    return (
      <Text color={config.color}>
        {config.icon} {toast.message}
      </Text>
    );
  };
  
  // Show only the latest toast to avoid clutter
  const latestToast = toasts.length > 0 ? toasts[toasts.length - 1] : null;
  
  return (
    <Box
      borderStyle="single"
      borderTop
      borderBottom={false}
      borderLeft={false}
      borderRight={false}
      borderColor={theme.borderSecondary}
      paddingX={1}
      flexDirection="row"
      alignItems="center"
    >
      {/* Current View */}
      <Box>
        <Text color={theme.primary}>
          {currentView.icon} {currentView.name}
        </Text>
      </Box>
      
      <Text color={theme.textDim}> {figures.vertical} </Text>
      
      {/* Project Status */}
      <Box>
        {execution.isRunning ? (
          <Text color={theme.warning}>
            {figures.spinner[Math.floor(Date.now() / 100) % figures.spinner.length]} Running...
          </Text>
        ) : (
          <Text>
            <Text color={theme.success}>{projectStatus.completedIssues}</Text>
            <Text color={theme.textDim}>/</Text>
            <Text color={theme.text}>{projectStatus.totalIssues}</Text>
            <Text color={theme.textSecondary}> issues</Text>
          </Text>
        )}
      </Box>
      
      {/* Failed issues indicator */}
      {projectStatus.failedIssues > 0 && (
        <>
          <Text color={theme.textDim}> {figures.vertical} </Text>
          <Text color={theme.error}>
            {figures.error} {projectStatus.failedIssues} failed
          </Text>
        </>
      )}
      
      <Spacer />
      
      {/* Right side info */}
      <Box>
        {/* Toast notification */}
        {latestToast && (
          <>
            <ToastItem toast={latestToast} />
            <Text color={theme.textDim}> {figures.vertical} </Text>
          </>
        )}
        
        {/* Theme indicator */}
        <Text color={theme.textSecondary}>
          Theme: {config.colorTheme}
        </Text>
        
        <Text color={theme.textDim}> {figures.vertical} </Text>
        
        {/* Provider */}
        <Text color={theme.textSecondary}>
          {config.provider}
        </Text>
        
        <Text color={theme.textDim}> {figures.vertical} </Text>
        
        {/* Current time */}
        <Text color={theme.textDim}>
          {new Date().toLocaleTimeString()}
        </Text>
      </Box>
    </Box>
  );
};

export default React.memo(StatusBar);