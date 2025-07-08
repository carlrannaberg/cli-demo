import { create } from 'zustand';
import { Configuration } from '../types/index.js';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { homedir } from 'node:os';
import { handleError, createRetryHandler } from '../utils/errorHandlers.js';
import { errorLogger } from '../utils/errorLogger.js';

const CONFIG_DIR = path.join(homedir(), '.cli-agent');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

const DEFAULT_CONFIG: Configuration = {
  defaultView: 'overview',
  colorTheme: 'default',
  autoCommit: false,
  provider: 'anthropic',
  keyboardShortcuts: {
    toggleCommandPalette: 'ctrl+p',
    toggleHelp: '?',
    navigateUp: 'up',
    navigateDown: 'down',
    select: 'enter',
    back: 'escape'
  },
  outputBufferSize: 1000,
  maxConcurrentExecutions: 1
};

interface ConfigState {
  config: Configuration;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadConfig: () => Promise<void>;
  saveConfig: () => Promise<void>;
  updateConfig: (updates: Partial<Configuration>) => void;
  resetToDefaults: () => void;
}

export const useConfigStore = create<ConfigState>((set, get) => ({
  config: DEFAULT_CONFIG,
  isLoading: false,
  error: null,
  
  loadConfig: async () => {
    set({ isLoading: true, error: null });
    
    const loadWithRetry = createRetryHandler(async () => {
      // Ensure config directory exists
      await fs.mkdir(CONFIG_DIR, { recursive: true });
      
      // Try to read config file
      try {
        const data = await fs.readFile(CONFIG_FILE, 'utf-8');
        const loadedConfig = JSON.parse(data) as Configuration;
        
        // Validate config structure
        if (typeof loadedConfig !== 'object' || loadedConfig === null) {
          throw new Error('Invalid configuration format');
        }
        
        // Merge with defaults to handle missing fields
        const mergedConfig = {
          ...DEFAULT_CONFIG,
          ...loadedConfig,
          keyboardShortcuts: {
            ...DEFAULT_CONFIG.keyboardShortcuts,
            ...(loadedConfig.keyboardShortcuts || {})
          }
        };
        
        set({ config: mergedConfig, isLoading: false });
      } catch (error) {
        // If file doesn't exist, use defaults and save them
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
          await get().saveConfig();
          set({ isLoading: false });
        } else {
          throw error;
        }
      }
    }, 3, 500);
    
    try {
      await loadWithRetry();
    } catch (error) {
      const errorMessage = await handleError(error, { 
        operation: 'load_config',
        file: CONFIG_FILE 
      });
      
      set({ 
        error: errorMessage,
        isLoading: false 
      });
      
      // Fall back to defaults on persistent failure
      set({ config: DEFAULT_CONFIG });
      await errorLogger.logWarning('Using default configuration due to load failure', {
        error: errorMessage
      });
    }
  },
  
  saveConfig: async () => {
    set({ error: null });
    
    const saveWithRetry = createRetryHandler(async () => {
      // Ensure config directory exists
      await fs.mkdir(CONFIG_DIR, { recursive: true });
      
      // Create backup of existing config
      const backupFile = `${CONFIG_FILE}.backup`;
      try {
        await fs.access(CONFIG_FILE);
        await fs.copyFile(CONFIG_FILE, backupFile);
      } catch {
        // No existing file to backup
      }
      
      // Save config atomically
      const tempFile = `${CONFIG_FILE}.tmp`;
      await fs.writeFile(
        tempFile, 
        JSON.stringify(get().config, null, 2),
        'utf-8'
      );
      
      // Atomic rename
      await fs.rename(tempFile, CONFIG_FILE);
    }, 3, 500);
    
    try {
      await saveWithRetry();
    } catch (error) {
      const errorMessage = await handleError(error, { 
        operation: 'save_config',
        file: CONFIG_FILE 
      });
      
      set({ error: errorMessage });
      
      // Try to restore from backup
      const backupFile = `${CONFIG_FILE}.backup`;
      try {
        await fs.access(backupFile);
        await fs.copyFile(backupFile, CONFIG_FILE);
        await errorLogger.logInfo('Restored configuration from backup', {
          file: CONFIG_FILE
        });
      } catch {
        // No backup available
      }
      
      throw new Error(errorMessage);
    }
  },
  
  updateConfig: (updates) => {
    set((state) => ({
      config: {
        ...state.config,
        ...updates,
        keyboardShortcuts: updates.keyboardShortcuts 
          ? { ...state.config.keyboardShortcuts, ...updates.keyboardShortcuts }
          : state.config.keyboardShortcuts
      }
    }));
  },
  
  resetToDefaults: () => {
    set({ config: DEFAULT_CONFIG });
  }
}));