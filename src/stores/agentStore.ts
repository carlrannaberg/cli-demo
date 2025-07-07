import { create } from 'zustand';
import { Issue, ProjectStatus, ExecutionState } from '../types/index.js';

interface AgentState {
  issues: Issue[];
  projectStatus: ProjectStatus;
  execution: ExecutionState;
  output: string[];
  
  // Actions
  loadIssues: (issues: Issue[]) => void;
  executeIssue: (issueId: string) => Promise<void>;
  executeAll: () => Promise<void>;
  addOutput: (message: string) => void;
  updateProjectStatus: () => void;
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

export const useAgentStore = create<AgentState>((set, get) => ({
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
    if (!issue || issue.status === 'completed') return;
    
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
    
    // Mock execution with progress updates
    for (let i = 0; i <= 100; i += 20) {
      // Simple delay without timers
      await new Promise(resolve => {
        // Simulate work being done
        resolve(undefined);
      });
      set((state) => ({
        execution: { ...state.execution, progress: i }
      }));
      get().addOutput(`Executing ${issue.title}: ${i}% complete`);
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
  },
  
  executeAll: async () => {
    const pendingIssues = get().issues.filter(i => 
      i.status === 'pending' || i.status === 'in-progress'
    );
    
    for (const issue of pendingIssues) {
      await get().executeIssue(issue.id);
    }
  },
  
  addOutput: (message) => set((state) => ({
    output: [...state.output, `[${new Date().toLocaleTimeString()}] ${message}`]
  })),
  
  updateProjectStatus: () => set((state) => ({
    projectStatus: {
      ...state.projectStatus,
      completedIssues: state.issues.filter(i => i.status === 'completed').length,
      failedIssues: state.issues.filter(i => i.status === 'failed').length,
      inProgress: state.issues.filter(i => i.status === 'in-progress').length,
      pending: state.issues.filter(i => i.status === 'pending').length,
      lastUpdated: new Date()
    }
  }))
}));