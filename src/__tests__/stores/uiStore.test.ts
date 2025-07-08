import { useUIStore } from '../../stores/uiStore';
import type { View } from '../../types';

// Helper to get store state
function getStore() {
  return useUIStore.getState();
}

describe('UIStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useUIStore.setState({
      activeView: 'overview',
      isCommandPaletteOpen: false,
      isHelpOpen: false,
      toasts: []
    });
  });

  describe('Initial State', () => {
    it('should have correct initial values', () => {
      const store = getStore();
      
      expect(store.activeView).toBe('overview');
      expect(store.isCommandPaletteOpen).toBe(false);
      expect(store.isHelpOpen).toBe(false);
      expect(store.toasts).toEqual([]);
    });
  });

  describe('setActiveView', () => {
    it('should change the active view', () => {
      const views: View[] = ['overview', 'issues', 'execution', 'logs', 'config'];
      
      views.forEach(view => {
        getStore().setActiveView(view);
        expect(getStore().activeView).toBe(view);
      });
    });
  });

  describe('toggleCommandPalette', () => {
    it('should toggle command palette state', () => {
      expect(getStore().isCommandPaletteOpen).toBe(false);
      
      getStore().toggleCommandPalette();
      expect(getStore().isCommandPaletteOpen).toBe(true);
      
      getStore().toggleCommandPalette();
      expect(getStore().isCommandPaletteOpen).toBe(false);
    });

    it('should close help when opening command palette', () => {
      // Set help to open
      useUIStore.setState({ isHelpOpen: true });
      expect(getStore().isHelpOpen).toBe(true);
      
      // Toggle command palette
      getStore().toggleCommandPalette();
      
      const store = getStore();
      expect(store.isCommandPaletteOpen).toBe(true);
      expect(store.isHelpOpen).toBe(false);
    });
  });

  describe('toggleHelp', () => {
    it('should toggle help state', () => {
      expect(getStore().isHelpOpen).toBe(false);
      
      getStore().toggleHelp();
      expect(getStore().isHelpOpen).toBe(true);
      
      getStore().toggleHelp();
      expect(getStore().isHelpOpen).toBe(false);
    });

    it('should close command palette when opening help', () => {
      // Set command palette to open
      useUIStore.setState({ isCommandPaletteOpen: true });
      expect(getStore().isCommandPaletteOpen).toBe(true);
      
      // Toggle help
      getStore().toggleHelp();
      
      const store = getStore();
      expect(store.isHelpOpen).toBe(true);
      expect(store.isCommandPaletteOpen).toBe(false);
    });
  });

  describe('showToast', () => {
    it('should add a toast with default duration', () => {
      getStore().showToast('Test message', 'success');
      
      const store = getStore();
      expect(store.toasts.length).toBe(1);
      expect(store.toasts[0]).toMatchObject({
        message: 'Test message',
        type: 'success',
        duration: 3000
      });
      expect(store.toasts[0].id).toBeDefined();
    });

    it('should add a toast with custom duration', () => {
      getStore().showToast('Custom duration', 'info', 5000);
      
      const store = getStore();
      expect(store.toasts[0]).toMatchObject({
        message: 'Custom duration',
        type: 'info',
        duration: 5000
      });
    });

    it('should support all toast types', () => {
      const types: Array<[string, 'success' | 'error' | 'info' | 'warning']> = [
        ['Success message', 'success'],
        ['Error message', 'error'],
        ['Info message', 'info'],
        ['Warning message', 'warning']
      ];

      types.forEach(([message, type]) => {
        getStore().showToast(message, type);
      });

      const store = getStore();
      expect(store.toasts.length).toBe(4);
      types.forEach(([message, type], index) => {
        expect(store.toasts[index].message).toBe(message);
        expect(store.toasts[index].type).toBe(type);
      });
    });

    it('should maintain toast order', () => {
      getStore().showToast('First', 'info');
      getStore().showToast('Second', 'info');
      getStore().showToast('Third', 'info');
      
      const store = getStore();
      expect(store.toasts[0].message).toBe('First');
      expect(store.toasts[1].message).toBe('Second');
      expect(store.toasts[2].message).toBe('Third');
    });

    it('should generate unique ids for toasts', async () => {
      // Add multiple toasts with small delays to ensure unique timestamps
      getStore().showToast('Toast 1', 'info');
      await new Promise(resolve => setTimeout(resolve, 1));
      getStore().showToast('Toast 2', 'info');
      await new Promise(resolve => setTimeout(resolve, 1));
      getStore().showToast('Toast 3', 'info');
      
      const store = getStore();
      const ids = store.toasts.map(t => t.id);
      const uniqueIds = new Set(ids);
      
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('hideToast', () => {
    it('should remove a toast by id', async () => {
      // Add some toasts with delays to ensure unique IDs
      getStore().showToast('Toast 1', 'info');
      await new Promise(resolve => setTimeout(resolve, 1));
      getStore().showToast('Toast 2', 'info');
      await new Promise(resolve => setTimeout(resolve, 1));
      getStore().showToast('Toast 3', 'info');
      
      const toastsBeforeRemoval = getStore().toasts;
      expect(toastsBeforeRemoval.length).toBe(3);
      
      const toastToRemove = toastsBeforeRemoval[1];
      
      getStore().hideToast(toastToRemove.id);
      
      const store = getStore();
      expect(store.toasts.length).toBe(2);
      expect(store.toasts.find(t => t.id === toastToRemove.id)).toBeUndefined();
      expect(store.toasts[0].message).toBe('Toast 1');
      expect(store.toasts[1].message).toBe('Toast 3');
    });

    it('should handle removing non-existent toast', () => {
      getStore().showToast('Toast 1', 'info');
      const toastsBefore = getStore().toasts.length;
      
      getStore().hideToast('non-existent-id');
      
      expect(getStore().toasts.length).toBe(toastsBefore);
    });

    it('should handle removing from empty toast list', () => {
      getStore().hideToast('any-id');
      
      expect(getStore().toasts.length).toBe(0);
    });
  });

  describe('Toast Management Scenarios', () => {
    it('should handle multiple toasts with overlays', () => {
      // Simulate a scenario where overlays and toasts are used together
      getStore().showToast('Starting operation', 'info');
      getStore().toggleCommandPalette();
      getStore().showToast('Command palette opened', 'success');
      
      const store = getStore();
      expect(store.toasts.length).toBe(2);
      expect(store.isCommandPaletteOpen).toBe(true);
    });

    it('should handle rapid toast creation and removal', async () => {
      // Add many toasts with small delays to ensure unique IDs
      for (let i = 0; i < 10; i++) {
        getStore().showToast(`Toast ${i}`, 'info');
        await new Promise(resolve => setTimeout(resolve, 1));
      }
      
      expect(getStore().toasts.length).toBe(10);
      
      // Remove even-indexed toasts
      const toastsToRemove = getStore().toasts.filter((_, index) => index % 2 === 0);
      toastsToRemove.forEach(toast => {
        getStore().hideToast(toast.id);
      });
      
      const remainingToasts = getStore().toasts;
      expect(remainingToasts.length).toBe(5);
      remainingToasts.forEach((toast, index) => {
        expect(toast.message).toBe(`Toast ${index * 2 + 1}`);
      });
    });
  });

  describe('State Combinations', () => {
    it('should not allow both overlays to be open simultaneously', () => {
      // Open command palette
      getStore().toggleCommandPalette();
      expect(getStore().isCommandPaletteOpen).toBe(true);
      expect(getStore().isHelpOpen).toBe(false);
      
      // Open help (should close command palette)
      getStore().toggleHelp();
      expect(getStore().isCommandPaletteOpen).toBe(false);
      expect(getStore().isHelpOpen).toBe(true);
      
      // Open command palette again (should close help)
      getStore().toggleCommandPalette();
      expect(getStore().isCommandPaletteOpen).toBe(true);
      expect(getStore().isHelpOpen).toBe(false);
    });

    it('should maintain view state when toggling overlays', () => {
      getStore().setActiveView('execution');
      getStore().toggleCommandPalette();
      
      expect(getStore().activeView).toBe('execution');
      
      getStore().toggleHelp();
      expect(getStore().activeView).toBe('execution');
    });
  });
});