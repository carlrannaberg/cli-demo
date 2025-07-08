import { useConfigStore } from '../stores/configStore.js';
import { darkTheme, lightTheme, Theme } from '../constants/theme.js';

export function useTheme(): Theme {
  const { config } = useConfigStore();
  
  // Return theme based on config
  return config.colorTheme === 'light' ? lightTheme : darkTheme;
}