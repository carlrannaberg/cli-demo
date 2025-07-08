import React, { useEffect, useRef } from 'react';
import { Box, Text } from 'ink';
import { useUIStore } from '../stores/uiStore.js';
import { Toast as ToastType } from '../types/index.js';

interface ToastItemProps {
  toast: ToastType;
  index: number;
}

const ToastItem = React.memo<ToastItemProps>(({ toast, index }) => {
  const { hideToast } = useUIStore();
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  
  useEffect(() => {
    if (toast.duration) {
      timerRef.current = global.setTimeout(() => {
        hideToast(toast.id);
      }, toast.duration);
      
      return () => {
        if (timerRef.current) {
          global.clearTimeout(timerRef.current);
        }
      };
    }
    return undefined;
  }, [toast.id, toast.duration, hideToast]);
  
  const colors = {
    success: 'green',
    error: 'red',
    info: 'blue',
    warning: 'yellow'
  };
  
  return (
    <Box
      position="absolute"
      marginTop={2 + (index * 3)}
      marginLeft={70}
      borderStyle="round"
      borderColor={colors[toast.type]}
      paddingX={1}
    >
      <Text color={colors[toast.type]}>{toast.message}</Text>
    </Box>
  );
});

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ToastProps {}

const Toast: React.FC<ToastProps> = () => {
  const { toasts } = useUIStore();
  
  if (toasts.length === 0) {return null;}
  
  return (
    <>
      {toasts.map((toast, index) => (
        <ToastItem key={toast.id} toast={toast} index={index} />
      ))}
    </>
  );
};

export default Toast;