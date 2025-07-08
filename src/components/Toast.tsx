import React, { useEffect, useRef } from 'react';
import { Box, Text } from 'ink';
import { useUIStore } from '../stores/uiStore.js';
import { useTheme } from '../hooks/useTheme.js';
import { figures } from '../constants/figures.js';
import { Toast as ToastType } from '../types/index.js';

interface ToastItemProps {
  toast: ToastType;
}

const ToastItem = React.memo<ToastItemProps>(({ toast }) => {
  const { hideToast } = useUIStore();
  const theme = useTheme();
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
  }, [toast.id, toast.duration, hideToast]);
  
  const toastConfig = {
    success: {
      color: theme.success,
      icon: figures.success,
      borderColor: theme.success
    },
    error: {
      color: theme.error,
      icon: figures.error,
      borderColor: theme.error
    },
    info: {
      color: theme.info,
      icon: figures.info,
      borderColor: theme.info
    },
    warning: {
      color: theme.warning,
      icon: figures.warning,
      borderColor: theme.warning
    }
  };
  
  const config = toastConfig[toast.type];
  
  return (
    <Box
      borderStyle="round"
      borderColor={config.borderColor}
      paddingX={1}
      paddingY={0}
      marginBottom={1}
    >
      <Text color={config.color}>{config.icon} </Text>
      <Text color={theme.text}>{toast.message}</Text>
    </Box>
  );
});

ToastItem.displayName = 'ToastItem';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ToastContainerProps {}

const Toast: React.FC<ToastContainerProps> = () => {
  const { toasts } = useUIStore();
  
  if (toasts.length === 0) {
    return null;
  }
  
  // Regular rendering - toasts will appear at the top and disappear after duration
  return (
    <Box flexDirection="column">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </Box>
  );
};

export default React.memo(Toast);