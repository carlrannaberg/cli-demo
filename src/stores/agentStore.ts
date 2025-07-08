import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { Issue, ProjectStatus, ExecutionState } from '../types/index.js';
import { CircularBuffer } from '../utils/performance.js';
import { handleError, createRetryHandler } from '../utils/errorHandlers.js';
import { errorLogger } from '../utils/errorLogger.js';
import { useUIStore } from './uiStore.js';

const MAX_OUTPUT_LINES = 1000;
const outputBuffer = new CircularBuffer<string>(MAX_OUTPUT_LINES);

interface ErrorSimulationConfig {
  enabled: boolean;
  probability: number; // 0-1, where 1 means always error
  minProgressBeforeError?: number; // Minimum progress before errors can occur
}

interface AgentState {
  issues: Issue[];
  projectStatus: ProjectStatus;
  execution: ExecutionState;
  output: string[];
  errorSimulation: ErrorSimulationConfig;
  
  // Actions
  loadIssues: (issues: Issue[]) => void;
  executeIssue: (issueId: string) => Promise<void>;
  executeAll: () => Promise<void>;
  addOutput: (message: string) => void;
  updateProjectStatus: () => void;
  clearOutput: () => void;
  setErrorSimulation: (config: Partial<ErrorSimulationConfig>) => void;
}

// Mock issues for initial development
const mockIssues: Issue[] = [
  {
    id: '1',
    title: 'Project Setup',
    description: 'Initialize project with dependencies',
    status: 'completed',
    acceptanceCriteria: ['Package.json created', 'Dependencies installed'],
    dependencies: [],
    output: ['Project initialized successfully']
  },
  {
    id: '2',
    title: 'Component Architecture',
    description: 'Build core UI components',
    status: 'pending',
    acceptanceCriteria: ['All components created', 'TypeScript types defined'],
    dependencies: ['1']
  },
  {
    id: '3',
    title: 'State Management',
    description: 'Implement Zustand stores',
    status: 'in-progress',
    acceptanceCriteria: ['Stores created', 'Actions implemented'],
    dependencies: ['1']
  }
];

export const useAgentStore = create<AgentState>()(subscribeWithSelector((set, get) => ({
  issues: mockIssues,
  projectStatus: {
    totalIssues: mockIssues.length,
    completedIssues: mockIssues.filter(i => i.status === 'completed').length,
    failedIssues: 0,
    inProgress: mockIssues.filter(i => i.status === 'in-progress').length,
    pending: mockIssues.filter(i => i.status === 'pending').length,
    currentPhase: 'Development',
    lastUpdated: new Date()
  },
  execution: {
    isRunning: false,
    progress: 0
  },
  output: [],
  errorSimulation: {
    enabled: false,
    probability: 0.1,
    minProgressBeforeError: 20
  },
  
  loadIssues: (issues) => set((state) => ({
    issues,
    projectStatus: {
      ...state.projectStatus,
      totalIssues: issues.length,
      completedIssues: issues.filter(i => i.status === 'completed').length,
      failedIssues: issues.filter(i => i.status === 'failed').length,
      inProgress: issues.filter(i => i.status === 'in-progress').length,
      pending: issues.filter(i => i.status === 'pending').length,
      lastUpdated: new Date()
    }
  })),
  
  executeIssue: async (issueId) => {
    const issue = get().issues.find(i => i.id === issueId);
    if (!issue || issue.status === 'completed') {return;}
    
    const { showToast } = useUIStore.getState();
    
    try {
      set((state) => ({
        execution: {
          isRunning: true,
          currentIssueId: issueId,
          progress: 0,
          startTime: new Date()
        },
        issues: state.issues.map(i => 
          i.id === issueId ? { ...i, status: 'in-progress' as const } : i
        )
      }));
      
      // Mock execution with progress updates - batch progress updates
      const progressUpdates: number[] = [];
      for (let i = 0; i <= 100; i += 20) {
        // Simple delay without timers
        await new Promise(resolve => {
          // Simulate work being done
          setTimeout(() => resolve(undefined), 100);
        });
        
        // Simulate errors based on configuration
        const { errorSimulation } = get();
        if (
          errorSimulation.enabled && 
          Math.random() < errorSimulation.probability && 
          i >= (errorSimulation.minProgressBeforeError || 0)
        ) {
          throw new Error(`Execution failed at ${i}% progress`);
        }
        
        progressUpdates.push(i);
        
        // Batch update every 2 progress updates or at completion
        if (progressUpdates.length >= 2 || i === 100) {
          const latestProgress = progressUpdates[progressUpdates.length - 1];
          set((state) => ({
            execution: { ...state.execution, progress: latestProgress }
          }));
          progressUpdates.forEach(progress => {
            get().addOutput(`Executing ${issue.title}: ${progress}% complete`);
          });
          progressUpdates.length = 0;
        }
      }
      
      // Complete the issue
      set((state) => ({
        execution: {
          isRunning: false,
          progress: 100,
          endTime: new Date()
        },
        issues: state.issues.map(i => 
          i.id === issueId 
            ? { 
                ...i, 
                status: 'completed' as const,
                output: [`${i.title} completed successfully`]
              } 
            : i
        )
      }));
      
      get().updateProjectStatus();
      get().addOutput(`✅ ${issue.title} completed successfully`);
      showToast(
        `${issue.title} completed successfully`,
        'success',
        3000
      );
      
    } catch (error) {
      const errorMessage = await handleError(error, {
        issueId,
        issueTitle: issue.title,
        context: 'issue_execution'
      });
      
      // Mark issue as failed
      set((state) => ({
        execution: {
          isRunning: false,
          progress: state.execution.progress || 0,
          endTime: new Date(),
          error: errorMessage
        },
        issues: state.issues.map(i => 
          i.id === issueId 
            ? { 
                ...i, 
                status: 'failed' as const,
                output: [`${i.title} failed: ${errorMessage}`]
              } 
            : i
        )
      }));
      
      get().updateProjectStatus();
      get().addOutput(`❌ ${issue.title} failed: ${errorMessage}`);
      
      showToast(
        `${issue.title} failed: ${errorMessage}`,
        'error',
        5000
      );
      
      throw error;
    }
  },
  
  executeAll: async () => {
    const { showToast } = useUIStore.getState();
    const pendingIssues = get().issues.filter(i => 
      i.status === 'pending' || i.status === 'in-progress' || i.status === 'failed'
    );
    
    let successCount = 0;
    let failureCount = 0;
    
    for (const issue of pendingIssues) {
      try {
        // Create retry handler for each issue
        const executeWithRetry = createRetryHandler(
          () => get().executeIssue(issue.id),
          2, // max retries
          1000 // delay
        );
        
        await executeWithRetry();
        successCount++;
      } catch (error) {
        failureCount++;
        await errorLogger.logError(
          error instanceof Error ? error : new Error(String(error)),
          { issueId: issue.id, context: 'execute_all' }
        );
      }
    }
    
    const message = `Execution complete: ${successCount} succeeded, ${failureCount} failed`;
    get().addOutput(message);
    
    showToast(
      message,
      failureCount > 0 ? 'warning' : 'success',
      5000
    );
  },
  
  addOutput: (message) => {
    const timestampedMessage = `[${new Date().toLocaleTimeString()}] ${message}`;
    outputBuffer.push(timestampedMessage);
    
    set(() => ({
      output: outputBuffer.getAll()
    }));
  },
  
  updateProjectStatus: () => set((state) => ({
    projectStatus: {
      ...state.projectStatus,
      completedIssues: state.issues.filter(i => i.status === 'completed').length,
      failedIssues: state.issues.filter(i => i.status === 'failed').length,
      inProgress: state.issues.filter(i => i.status === 'in-progress').length,
      pending: state.issues.filter(i => i.status === 'pending').length,
      lastUpdated: new Date()
    }
  })),
  
  clearOutput: () => {
    outputBuffer.clear();
    set(() => ({
      output: []
    }));
  },
  
  setErrorSimulation: (config) => set((state) => ({
    errorSimulation: {
      ...state.errorSimulation,
      ...config
    }
  }))
})));