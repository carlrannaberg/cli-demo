export interface Theme {
  // Brand colors
  primary: string;       // Claude blue
  secondary: string;     // Mode accent (pink for bash)
  accent: string;        // Highlights and selections
  
  // Text colors
  text: string;
  textSecondary: string;
  textDim: string;
  suggestion: string;    // Autocomplete suggestions
  
  // Border colors
  borderPrimary: string;
  borderSecondary: string;
  borderAccent: string;
  replBorder: string;    // REPL mode border
  bashBorder: string;    // Bash mode border
  
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
  permission: string;    // Permission dialogs
  
  // Diff colors (for future use)
  diff: {
    added: string;
    removed: string;
    addedDimmed: string;
    removedDimmed: string;
  };
}

export const darkTheme: Theme = {
  // Brand colors
  primary: '#5f97cd',      // Claude blue
  secondary: '#fd5db1',    // Bright pink
  accent: '#b1b9f9',       // Light lavender
  
  // Text colors
  text: '#ffffff',
  textSecondary: '#999999',
  textDim: '#666666',
  suggestion: '#b1b9f9',   // Light lavender for suggestions
  
  // Border colors
  borderPrimary: '#5f97cd',    // Claude blue
  borderSecondary: '#333333',  // Dark gray
  borderAccent: '#b1b9f9',     // Lavender
  replBorder: '#5f97cd',       // Claude blue for REPL
  bashBorder: '#fd5db1',       // Pink for bash mode
  
  // Semantic colors
  success: '#4eba65',      // Green
  error: '#ff6b80',        // Red
  warning: '#ffc107',      // Amber
  info: '#5f97cd',         // Blue
  
  // Component-specific colors
  inputBorder: '#333333',
  inputBorderActive: '#5f97cd',
  statusBarBg: 'transparent',
  commandPaletteBg: 'transparent',
  permission: '#b1b9f9',   // Lavender for permissions
  
  // Diff colors
  diff: {
    added: '#1a3a1a',      // Dark green background
    removed: '#3a1a1a',    // Dark red background
    addedDimmed: '#0d1a0d',
    removedDimmed: '#1a0d0d'
  }
};

export const lightTheme: Theme = {
  // Brand colors
  primary: '#5f97cd',      // Claude blue (same)
  secondary: '#ff0087',    // Hot pink
  accent: '#5769f7',       // Purple-blue
  
  // Text colors
  text: '#000000',
  textSecondary: '#666666',
  textDim: '#999999',
  suggestion: '#5769f7',   // Purple-blue for suggestions
  
  // Border colors
  borderPrimary: '#5f97cd',    // Claude blue
  borderSecondary: '#cccccc',  // Light gray
  borderAccent: '#5769f7',     // Purple-blue
  replBorder: '#5f97cd',       // Claude blue for REPL
  bashBorder: '#ff0087',       // Hot pink for bash mode
  
  // Semantic colors
  success: '#2c7a39',      // Dark green
  error: '#ab2b3f',        // Dark red
  warning: '#966c1e',      // Dark amber
  info: '#5f97cd',         // Blue
  
  // Component-specific colors
  inputBorder: '#cccccc',
  inputBorderActive: '#5f97cd',
  statusBarBg: 'transparent',
  commandPaletteBg: 'transparent',
  permission: '#5769f7',   // Purple-blue for permissions
  
  // Diff colors
  diff: {
    added: '#e6ffe6',      // Light green background
    removed: '#ffe6e6',    // Light red background
    addedDimmed: '#f0fff0',
    removedDimmed: '#fff0f0'
  }
};

// Default to dark theme
export const defaultTheme = darkTheme;