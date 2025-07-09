import { create } from 'zustand';
import { View, Toast, ToastType } from '../types/index.js';

/**
 * UI state interface for managing application UI state.
 * 
 * @interface UIState
 */
interface UIState {
  /** Currently active view */
  activeView: View;
  /** Whether command palette is open */
  isCommandPaletteOpen: boolean;
  /** Whether help modal is open */
  isHelpOpen: boolean;
  /** Active toast notifications */
  toasts: Toast[];
  
  // Actions
  /** Set the active view */
  setActiveView: (view: View) => void;
  /** Toggle command palette visibility */
  toggleCommandPalette: () => void;
  /** Toggle help modal visibility */
  toggleHelp: () => void;
  /** Show a toast notification */
  showToast: (message: string, type: ToastType, duration?: number) => void;
  /** Hide a specific toast */
  hideToast: (id: string) => void;
}

/**
 * UI store for managing application UI state.
 * 
 * @remarks
 * This store manages:
 * - Active view routing
 * - Modal visibility (command palette, help)
 * - Toast notifications
 * 
 * @example
 * ```tsx
 * const { activeView, setActiveView } = useUIStore();
 * 
 * // Navigate to issues view
 * setActiveView('issues');
 * 
 * // Show success toast
 * showToast('Operation completed!', 'success');
 * ```
 */
// Counter for generating unique toast IDs
let toastCounter = 0;

export const useUIStore = create<UIState>((set) => ({
  activeView: 'repl',
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
    // Generate unique ID using timestamp and counter
    const toastId = `${Date.now()}-${toastCounter++}`;
    
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