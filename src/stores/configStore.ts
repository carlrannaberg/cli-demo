import { create } from 'zustand';
import { Configuration } from '../types/index.js';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { homedir } from 'node:os';

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
    
    try {
      // Ensure config directory exists
      await fs.mkdir(CONFIG_DIR, { recursive: true });
      
      // Try to read config file
      try {
        const data = await fs.readFile(CONFIG_FILE, 'utf-8');
        const loadedConfig = JSON.parse(data) as Configuration;
        
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
        if ((error as any).code === 'ENOENT') {
          await get().saveConfig();
        } else {
          throw error;
        }
      }
    } catch (error) {
      set({ 
        error: `Failed to load configuration: ${error instanceof Error ? error.message : String(error)}`,
        isLoading: false 
      });
    }
  },
  
  saveConfig: async () => {
    set({ error: null });
    
    try {
      // Ensure config directory exists
      await fs.mkdir(CONFIG_DIR, { recursive: true });
      
      // Save config
      await fs.writeFile(
        CONFIG_FILE, 
        JSON.stringify(get().config, null, 2),
        'utf-8'
      );
    } catch (error) {
      set({ 
        error: `Failed to save configuration: ${error instanceof Error ? error.message : String(error)}`
      });
      throw error;
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