// Unicode characters for visual elements
export const figures = {
  // Bullets and indicators
  bullet: '•',
  pointer: '❯',
  arrowRight: '→',
  arrowLeft: '←',
  arrowUp: '↑',
  arrowDown: '↓',
  
  // Status indicators
  success: '✓',
  error: '✗',
  warning: '⚠',
  info: 'ℹ',
  
  // Box drawing
  cornerTopLeft: '╭',
  cornerTopRight: '╮',
  cornerBottomLeft: '╰',
  cornerBottomRight: '╯',
  horizontal: '─',
  vertical: '│',
  
  // Special characters
  star: '★',
  sparkle: '✨',
  lightning: '⚡',
  gear: '⚙',
  package: '📦',
  rocket: '🚀',
  
  // Brand icon
  logo: '✻',
  
  // Input prompts
  bashPrompt: '!',
  normalPrompt: '>',
  
  // Progress indicators
  spinner: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
  progressFull: '█',
  progressEmpty: '░',
} as const;

export type Figure = keyof typeof figures;