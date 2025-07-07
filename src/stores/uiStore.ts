import { create } from 'zustand';
import { View, Toast, ToastType } from '../types/index.js';

interface UIState {
  activeView: View;
  isCommandPaletteOpen: boolean;
  isHelpOpen: boolean;
  toasts: Toast[];
  
  // Actions
  setActiveView: (view: View) => void;
  toggleCommandPalette: () => void;
  toggleHelp: () => void;
  showToast: (message: string, type: ToastType, duration?: number) => void;
  hideToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeView: 'overview',
  isCommandPaletteOpen: false,
  isHelpOpen: false,
  toasts: [],
  
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
    
    // Create new toast
    const toast: Toast = {
      id: toastId,
      message,
      type,
      duration
    };
    
    // Add to queue
    set((state) => ({ toasts: [...state.toasts, toast] }));
  },
  
  hideToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter(t => t.id !== id) }));
  }
}));