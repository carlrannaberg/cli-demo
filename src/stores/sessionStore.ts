import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { 
  SessionInfo, 
  TaskEvent, 
  ExecutionStats, 
  REPLOutput, 
  StreamingUpdate,
  REPLCommand 
} from '../types/index.js';
import { CircularBuffer } from '../utils/performance.js';

const MAX_EVENTS = 10000;
const MAX_OUTPUT_LINES = 5000;

interface SessionState {
  // Session management
  currentSession: SessionInfo | null;
  sessions: SessionInfo[];
  
  // Real-time data streams
  events: TaskEvent[];
  outputs: REPLOutput[];
  streamingUpdates: StreamingUpdate[];
  
  // Statistics and monitoring
  stats: ExecutionStats;
  
  // Command history
  commandHistory: REPLCommand[];
  
  // Actions
  startSession: (sessionId?: string) => void;
  stopSession: () => void;
  pauseSession: () => void;
  resumeSession: () => void;
  
  // Event and output management
  addEvent: (event: TaskEvent) => void;
  addOutput: (output: REPLOutput) => void;
  addStreamingUpdate: (update: StreamingUpdate) => void;
  clearEvents: () => void;
  clearOutput: () => void;
  
  // Command management
  addCommand: (command: REPLCommand) => void;
  getCommandHistory: () => REPLCommand[];
  
  // Statistics
  updateStats: (stats: Partial<ExecutionStats>) => void;
  
  // Mock data generation
  generateMockSession: () => void;
  simulateTaskExecution: (taskName: string) => Promise<void>;
  startDemoSession: () => void;
  
  // Autonomous execution
  autoExecuteAll: () => Promise<void>;
  pauseAutoExecution: () => void;
  resumeAutoExecution: () => void;
  getAvailableTasks: () => string[];
  isAutoExecuting: boolean;
}

// Create circular buffers for performance
const eventBuffer = new CircularBuffer<TaskEvent>(MAX_EVENTS);
const outputBuffer = new CircularBuffer<REPLOutput>(MAX_OUTPUT_LINES);

// Generate unique IDs

const generateId = (prefix: string): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const useSessionStore = create<SessionState>()(
  subscribeWithSelector((set, get) => ({
    currentSession: null,
    sessions: [],
    events: [],
    outputs: [],
    streamingUpdates: [],
    stats: {
      totalTasks: 0,
      completedTasks: 0,
      failedTasks: 0,
      runningTasks: 0,
      averageTaskTime: 0,
      successRate: 0,
      currentThroughput: 0,
      uptime: 0
    },
    commandHistory: [],
    isAutoExecuting: false,

    startSession: (sessionId) => {
      const id = sessionId || generateId('session');
      const session: SessionInfo = {
        id,
        startTime: new Date(),
        status: 'active',
        totalTasks: 0,
        completedTasks: 0,
        failedTasks: 0,
        currentPhase: 'Initialization',
        metadata: {}
      };

      set((state) => ({
        currentSession: session,
        sessions: [...state.sessions, session],
        stats: {
          ...state.stats,
          uptime: 0
        }
      }));

      // Add system output
      get().addOutput({
        id: generateId('output'),
        timestamp: new Date(),
        type: 'system',
        content: `Session ${id} started`,
        metadata: { sessionId: id }
      });
    },

    stopSession: () => {
      const currentSession = get().currentSession;
      if (!currentSession) {
        return;
      }

      const updatedSession: SessionInfo = {
        ...currentSession,
        endTime: new Date(),
        status: 'completed'
      };

      set((state) => ({
        currentSession: null,
        sessions: state.sessions.map(s => 
          s.id === currentSession.id ? updatedSession : s
        )
      }));

      // Add system output
      get().addOutput({
        id: generateId('output'),
        timestamp: new Date(),
        type: 'system',
        content: `Session ${currentSession.id} stopped`,
        metadata: { sessionId: currentSession.id }
      });
    },

    pauseSession: () => {
      const currentSession = get().currentSession;
      if (!currentSession) {
        return;
      }

      const updatedSession: SessionInfo = {
        ...currentSession,
        status: 'paused'
      };

      set((state) => ({
        currentSession: updatedSession,
        sessions: state.sessions.map(s => 
          s.id === currentSession.id ? updatedSession : s
        )
      }));

      get().addOutput({
        id: generateId('output'),
        timestamp: new Date(),
        type: 'system',
        content: `Session ${currentSession.id} paused`,
        metadata: { sessionId: currentSession.id }
      });
    },

    resumeSession: () => {
      const currentSession = get().currentSession;
      if (!currentSession) {
        return;
      }

      const updatedSession: SessionInfo = {
        ...currentSession,
        status: 'active'
      };

      set((state) => ({
        currentSession: updatedSession,
        sessions: state.sessions.map(s => 
          s.id === currentSession.id ? updatedSession : s
        )
      }));

      get().addOutput({
        id: generateId('output'),
        timestamp: new Date(),
        type: 'system',
        content: `Session ${currentSession.id} resumed`,
        metadata: { sessionId: currentSession.id }
      });
    },

    addEvent: (event) => {
      eventBuffer.push(event);
      
      set((state) => ({
        events: eventBuffer.getAll(),
        streamingUpdates: [...state.streamingUpdates, {
          id: generateId('update'),
          timestamp: new Date(),
          type: 'event',
          data: event
        }]
      }));

      // Update session stats based on event
      const currentSession = get().currentSession;
      if (currentSession && event.type === 'completed') {
        const updatedSession = {
          ...currentSession,
          completedTasks: currentSession.completedTasks + 1
        };
        
        set((state) => ({
          currentSession: updatedSession,
          sessions: state.sessions.map(s => 
            s.id === currentSession.id ? updatedSession : s
          )
        }));
      }
    },

    addOutput: (output) => {
      outputBuffer.push(output);
      
      set((state) => ({
        outputs: outputBuffer.getAll(),
        streamingUpdates: [...state.streamingUpdates, {
          id: generateId('update'),
          timestamp: new Date(),
          type: 'output',
          data: output
        }]
      }));
    },

    addStreamingUpdate: (update) => {
      set((state) => ({
        streamingUpdates: [...state.streamingUpdates, update]
      }));
    },

    clearEvents: () => {
      eventBuffer.clear();
      set(() => ({
        events: []
      }));
    },

    clearOutput: () => {
      outputBuffer.clear();
      set(() => ({
        outputs: []
      }));
    },

    addCommand: (command) => {
      set((state) => ({
        commandHistory: [...state.commandHistory, command]
      }));
    },

    getCommandHistory: () => {
      return get().commandHistory;
    },

    updateStats: (newStats) => {
      set((state) => ({
        stats: {
          ...state.stats,
          ...newStats
        },
        streamingUpdates: [...state.streamingUpdates, {
          id: generateId('update'),
          timestamp: new Date(),
          type: 'stats',
          data: { ...state.stats, ...newStats }
        }]
      }));
    },

    generateMockSession: () => {
      const sessionId = generateId('mock-session');
      get().startSession(sessionId);
      
      // Generate mock tasks
      const mockTasks = [
        'Initialize project structure',
        'Set up development environment',
        'Create authentication system',
        'Implement user interface',
        'Add data persistence layer',
        'Configure deployment pipeline',
        'Run comprehensive tests',
        'Optimize performance',
        'Deploy to production'
      ];

      // Update session with mock data
      const currentSession = get().currentSession;
      if (currentSession) {
        const updatedSession = {
          ...currentSession,
          totalTasks: mockTasks.length,
          currentPhase: 'Development'
        };
        
        set((state) => ({
          currentSession: updatedSession,
          sessions: state.sessions.map(s => 
            s.id === currentSession.id ? updatedSession : s
          )
        }));
      }

      // Add initial output
      get().addOutput({
        id: generateId('output'),
        timestamp: new Date(),
        type: 'system',
        content: `Mock session initialized with ${mockTasks.length} tasks`,
        metadata: { sessionId, taskCount: mockTasks.length }
      });
    },

    startDemoSession: () => {
      const sessionId = generateId('demo-session');
      get().startSession(sessionId);
      
      // Enhanced demo tasks for autonomous coding
      const demoTasks = [
        'Analyze codebase structure',
        'Setup development environment',
        'Create React components',
        'Implement state management',
        'Add TypeScript definitions',
        'Configure build pipeline',
        'Write unit tests',
        'Implement error handling',
        'Add performance monitoring',
        'Deploy to production'
      ];

      // Update session with demo data
      const currentSession = get().currentSession;
      if (currentSession) {
        const updatedSession = {
          ...currentSession,
          totalTasks: demoTasks.length,
          currentPhase: 'Autonomous Development',
          metadata: {
            sessionType: 'demo',
            startTime: new Date().toISOString(),
            features: ['real-time-monitoring', 'streaming-updates', 'task-execution']
          }
        };
        
        set((state) => ({
          currentSession: updatedSession,
          sessions: state.sessions.map(s => 
            s.id === currentSession.id ? updatedSession : s
          )
        }));
      }

      // Add demo initialization output
      get().addOutput({
        id: generateId('output'),
        timestamp: new Date(),
        type: 'system',
        content: `🚀 Demo session started! This showcases autonomous coding capabilities.`,
        metadata: { sessionId, taskCount: demoTasks.length }
      });

      get().addOutput({
        id: generateId('output'),
        timestamp: new Date(),
        type: 'system',
        content: `📋 ${demoTasks.length} tasks queued for execution. Use 'execute <task>' to run individual tasks.`,
        metadata: { sessionId, availableTasks: demoTasks }
      });

      get().addOutput({
        id: generateId('output'),
        timestamp: new Date(),
        type: 'system',
        content: `💡 Try commands: 'auto-execute' for continuous execution, 'monitor' for stats, 'status' for session info`,
        metadata: { sessionId }
      });

      // Store demo tasks for execution
      if (currentSession) {
        const demoTasksWithIds = demoTasks.map((task, index) => ({
          id: generateId(`demo-task-${index}`),
          name: task,
          status: 'pending' as const,
          description: `Demo task: ${task}`,
          estimatedTime: Math.random() * 3000 + 1000 // 1-4 seconds
        }));

        set((state) => {
          if (state.currentSession) {
            return {
              currentSession: {
                ...state.currentSession,
                metadata: {
                  ...state.currentSession.metadata,
                  demoTasks: demoTasksWithIds
                }
              }
            };
          }
          return state;
        });
      }
    },

    simulateTaskExecution: async (taskName) => {
      const taskId = generateId('task');
      const currentSession = get().currentSession;
      
      if (!currentSession) {
        throw new Error('No active session');
      }

      // Start task
      get().addEvent({
        id: generateId('event'),
        timestamp: new Date(),
        type: 'started',
        taskId,
        taskName,
        content: `Started: ${taskName}`,
        progress: 0,
        metadata: { sessionId: currentSession.id }
      });

      // Update running tasks count
      const currentStats = get().stats;
      get().updateStats({
        runningTasks: currentStats.runningTasks + 1
      });

      // Simulate progress
      for (let progress = 0; progress <= 100; progress += 25) {
        await new Promise(resolve => setTimeout(resolve, 200));
        
        if (progress < 100) {
          get().addEvent({
            id: generateId('event'),
            timestamp: new Date(),
            type: 'progress',
            taskId,
            taskName,
            content: `Progress: ${progress}%`,
            progress,
            metadata: { sessionId: currentSession.id }
          });
        }
      }

      // Complete task
      get().addEvent({
        id: generateId('event'),
        timestamp: new Date(),
        type: 'completed',
        taskId,
        taskName,
        content: `Completed: ${taskName}`,
        progress: 100,
        metadata: { sessionId: currentSession.id }
      });

      // Update demo task status if it exists
      if (currentSession.metadata?.demoTasks) {
        const demoTasks = currentSession.metadata.demoTasks as Array<{
          id: string;
          name: string;
          status: 'pending' | 'completed' | 'failed';
        }>;

        const updatedTasks = demoTasks.map(task => 
          task.name === taskName ? { ...task, status: 'completed' as const } : task
        );

        set((state) => {
          if (state.currentSession) {
            return {
              currentSession: {
                ...state.currentSession,
                completedTasks: state.currentSession.completedTasks + 1,
                metadata: {
                  ...state.currentSession.metadata,
                  demoTasks: updatedTasks
                }
              }
            };
          }
          return state;
        });
      }

      // Update stats
      const stats = get().stats;
      get().updateStats({
        totalTasks: stats.totalTasks + 1,
        completedTasks: stats.completedTasks + 1,
        runningTasks: Math.max(0, stats.runningTasks - 1),
        successRate: ((stats.completedTasks + 1) / (stats.totalTasks + 1)) * 100,
        averageTaskTime: ((stats.averageTaskTime * stats.totalTasks) + 1) / (stats.totalTasks + 1)
      });
    },

    autoExecuteAll: async () => {
      const currentSession = get().currentSession;
      if (!currentSession) {
        throw new Error('No active session for auto-execution');
      }

      const availableTasks = get().getAvailableTasks();
      if (availableTasks.length === 0) {
        get().addOutput({
          id: generateId('output'),
          timestamp: new Date(),
          type: 'system',
          content: 'No tasks available for auto-execution',
          metadata: { sessionId: currentSession.id }
        });
        return;
      }

      set(() => ({ isAutoExecuting: true }));

      get().addOutput({
        id: generateId('output'),
        timestamp: new Date(),
        type: 'system',
        content: `🤖 Starting autonomous execution of ${availableTasks.length} tasks...`,
        metadata: { sessionId: currentSession.id, taskCount: availableTasks.length }
      });

      try {
        for (const task of availableTasks) {
          if (!get().isAutoExecuting) {
            break; // Execution was paused
          }

          await get().simulateTaskExecution(task);
          
          // Add delay between tasks for realistic simulation
          await new Promise(resolve => setTimeout(resolve, 500));
        }

        get().addOutput({
          id: generateId('output'),
          timestamp: new Date(),
          type: 'system',
          content: `✅ Autonomous execution completed successfully!`,
          metadata: { sessionId: currentSession.id }
        });
      } catch (error) {
        get().addOutput({
          id: generateId('output'),
          timestamp: new Date(),
          type: 'error',
          content: `❌ Auto-execution failed: ${error instanceof Error ? error.message : String(error)}`,
          metadata: { sessionId: currentSession.id }
        });
      } finally {
        set(() => ({ isAutoExecuting: false }));
      }
    },

    pauseAutoExecution: () => {
      set(() => ({ isAutoExecuting: false }));
      const currentSession = get().currentSession;
      if (currentSession) {
        get().addOutput({
          id: generateId('output'),
          timestamp: new Date(),
          type: 'system',
          content: '⏸️ Autonomous execution paused',
          metadata: { sessionId: currentSession.id }
        });
      }
    },

    resumeAutoExecution: () => {
      const currentSession = get().currentSession;
      if (currentSession) {
        get().addOutput({
          id: generateId('output'),
          timestamp: new Date(),
          type: 'system',
          content: '▶️ Autonomous execution resumed',
          metadata: { sessionId: currentSession.id }
        });
        
        // Continue auto-execution with remaining tasks
        get().autoExecuteAll();
      }
    },

    getAvailableTasks: () => {
      const currentSession = get().currentSession;
      if (!currentSession || !currentSession.metadata) {
        return [];
      }

      const demoTasks = currentSession.metadata.demoTasks as Array<{
        id: string;
        name: string;
        status: 'pending' | 'completed' | 'failed';
      }> || [];

      return demoTasks
        .filter(task => task.status === 'pending')
        .map(task => task.name);
    }
  }))
);