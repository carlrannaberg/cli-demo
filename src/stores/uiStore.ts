import { create } from 'zustand';
import { View, Toast, ToastType } from '../types/index.js';

interface UIState {
  activeView: View;
  isCommandPaletteOpen: boolean;
  isHelpOpen: boolean;
  toast: Toast | null;
  
  // Actions
  setActiveView: (view: View) => void;
  toggleCommandPalette: () => void;
  toggleHelp: () => void;
  showToast: (message: string, type: ToastType, duration?: number) => void;
  hideToast: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeView: 'overview',
  isCommandPaletteOpen: false,
  isHelpOpen: false,
  toast: null,
  
  setActiveView: (view) => set({ activeView: view }),
  
  toggleCommandPalette: () => set((state) => ({
    isCommandPaletteOpen: !state.isCommandPaletteOpen,
    isHelpOpen: false // Close help if command palette opens
  })),
  
  toggleHelp: () => set((state) => ({
    isHelpOpen: !state.isHelpOpen,
    isCommandPaletteOpen: false // Close command palette if help opens
  })),
  
  showToast: (message, type, duration = 3000) => {
    const toastId = Date.now().toString();
    
    // Set new toast
    const toast: Toast = {
      id: toastId,
      message,
      type,
      duration
    };
    
    set({ toast });
    
    // Note: In a real implementation, the UI component displaying the toast
    // would handle the auto-hide behavior after the specified duration
  },
  
  hideToast: () => {
    set({ toast: null });
  }
}));