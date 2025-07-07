/**
 * Represents an issue or task to be executed by the agent.
 */
export interface Issue {
  /** Unique identifier for the issue */
  id: string;
  /** Issue title */
  title: string;
  /** Detailed description of the issue */
  description: string;
  /** Current execution status */
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  /** List of acceptance criteria that must be met */
  acceptanceCriteria: string[];
  /** IDs of issues that must be completed before this one */
  dependencies: string[];
  /** Agent assigned to execute this issue */
  assignedAgent?: string;
  /** Execution output lines */
  output?: string[];
  /** Error message if execution failed */
  error?: string;
}

/**
 * Overall project status metrics.
 */
export interface ProjectStatus {
  /** Total number of issues in the project */
  totalIssues: number;
  /** Number of successfully completed issues */
  completedIssues: number;
  /** Number of failed issues */
  failedIssues: number;
  /** Number of issues currently being executed */
  inProgress: number;
  /** Number of issues waiting to be executed */
  pending: number;
  /** Current project phase or milestone */
  currentPhase: string;
  /** Last time the status was updated */
  lastUpdated: Date;
}

/**
 * Type of toast notification.
 */
export type ToastType = 'success' | 'error' | 'info' | 'warning';

/**
 * Toast notification for user feedback.
 */
export interface Toast {
  /** Unique identifier for the toast */
  id: string;
  /** Message to display */
  message: string;
  /** Type of notification */
  type: ToastType;
  /** Duration in milliseconds before auto-dismiss */
  duration?: number;
}

/**
 * Available application views.
 */
export type View = 'overview' | 'issues' | 'execution' | 'logs' | 'config';

export interface ExecutionState {
  isRunning: boolean;
  currentIssueId?: string;
  progress: number;
  startTime?: Date;
  endTime?: Date;
}

/**
 * Application configuration settings.
 */
export interface Configuration {
  // UI preferences
  /** Default view to show on startup */
  defaultView: View;
  /** Color theme for the UI */
  colorTheme: 'default' | 'dark' | 'light';
  
  // Execution settings
  /** Whether to automatically commit changes after execution */
  autoCommit: boolean;
  /** AI provider to use for agent execution */
  provider: 'anthropic' | 'openai' | 'custom';
  
  /** Customizable keyboard shortcuts */
  keyboardShortcuts: {
    /** Toggle command palette (default: ctrl+p) */
    toggleCommandPalette: string;
    /** Toggle help modal (default: ?) */
    toggleHelp: string;
    /** Navigate up in lists (default: up) */
    navigateUp: string;
    /** Navigate down in lists (default: down) */
    navigateDown: string;
    /** Select current item (default: enter) */
    select: string;
    /** Go back/cancel (default: escape) */
    back: string;
  };
  
  // Performance settings
  /** Maximum lines to keep in execution output buffer */
  outputBufferSize: number;
  /** Maximum parallel executions allowed */
  maxConcurrentExecutions: number;
}