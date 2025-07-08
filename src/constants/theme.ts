export interface Theme {
  // Brand colors
  primary: string;
  secondary: string;
  accent: string;
  
  // Text colors
  text: string;
  textSecondary: string;
  textDim: string;
  
  // Border colors
  borderPrimary: string;
  borderSecondary: string;
  borderAccent: string;
  
  // Semantic colors
  success: string;
  error: string;
  warning: string;
  info: string;
  
  // Component-specific colors
  inputBorder: string;
  inputBorderActive: string;
  statusBarBg: string;
  commandPaletteBg: string;
}

export const darkTheme: Theme = {
  // Brand colors
  primary: '#5f97cd',      // Claude blue
  secondary: '#ff0087',    // Hot pink
  accent: '#5769f7',       // Purple
  
  // Text colors
  text: '#ffffff',
  textSecondary: '#999999',
  textDim: '#666666',
  
  // Border colors
  borderPrimary: '#fd5db1',    // Softer pink
  borderSecondary: '#999999',
  borderAccent: '#5769f7',
  
  // Semantic colors
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  
  // Component-specific colors
  inputBorder: '#999999',
  inputBorderActive: '#5f97cd',
  statusBarBg: 'transparent',
  commandPaletteBg: 'transparent',
};

export const lightTheme: Theme = {
  // Brand colors
  primary: '#2563eb',
  secondary: '#dc2626',
  accent: '#7c3aed',
  
  // Text colors
  text: '#000000',
  textSecondary: '#666666',
  textDim: '#999999',
  
  // Border colors
  borderPrimary: '#dc2626',
  borderSecondary: '#cccccc',
  borderAccent: '#7c3aed',
  
  // Semantic colors
  success: '#059669',
  error: '#dc2626',
  warning: '#d97706',
  info: '#2563eb',
  
  // Component-specific colors
  inputBorder: '#cccccc',
  inputBorderActive: '#2563eb',
  statusBarBg: 'transparent',
  commandPaletteBg: 'transparent',
};

// Default to dark theme
export const defaultTheme = darkTheme;