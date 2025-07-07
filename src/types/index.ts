export interface Issue {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  acceptanceCriteria: string[];
  dependencies: string[];
  assignedAgent?: string;
  output?: string[];
  error?: string;
}

export interface ProjectStatus {
  totalIssues: number;
  completedIssues: number;
  failedIssues: number;
  inProgress: number;
  pending: number;
  currentPhase: string;
  lastUpdated: Date;
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

export type View = 'overview' | 'issues' | 'execution' | 'logs' | 'config';

export interface ExecutionState {
  isRunning: boolean;
  currentIssueId?: string;
  progress: number;
  startTime?: Date;
  endTime?: Date;
}

export interface Configuration {
  // UI preferences
  defaultView: View;
  colorTheme: 'default' | 'dark' | 'light';
  
  // Execution settings
  autoCommit: boolean;
  provider: 'anthropic' | 'openai' | 'custom';
  
  // Keyboard shortcuts (customizable)
  keyboardShortcuts: {
    toggleCommandPalette: string;
    toggleHelp: string;
    navigateUp: string;
    navigateDown: string;
    select: string;
    back: string;
  };
  
  // Performance settings
  outputBufferSize: number;
  maxConcurrentExecutions: number;
}