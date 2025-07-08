import { useAgentStore } from '../../stores/agentStore';
import type { Issue } from '../../types';

// Helper to get store state
function getStore() {
  return useAgentStore.getState();
}

describe('AgentStore', () => {
  beforeEach(() => {
    // Clear output buffer before each test
    useAgentStore.getState().clearOutput();
    
    // Reset store state before each test, but keep mock issues
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

    useAgentStore.setState({
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
      }
    });
  });

  describe('Initial State', () => {
    it('should have initial mock issues', () => {
      const store = getStore();
      
      expect(store.issues.length).toBeGreaterThan(0);
      expect(store.projectStatus.totalIssues).toBe(store.issues.length);
    });

    it('should have correct initial execution state', () => {
      const store = getStore();
      
      expect(store.execution.isRunning).toBe(false);
      expect(store.execution.progress).toBe(0);
    });

    it('should have empty output initially', () => {
      const store = getStore();
      
      expect(store.output).toEqual([]);
    });
  });

  describe('loadIssues', () => {
    it('should load new issues and update project status', () => {
      const newIssues: Issue[] = [
        {
          id: 'test-1',
          title: 'Test Issue 1',
          description: 'Test Description 1',
          status: 'pending',
          acceptanceCriteria: ['Criteria 1'],
          dependencies: []
        },
        {
          id: 'test-2',
          title: 'Test Issue 2',
          description: 'Test Description 2',
          status: 'completed',
          acceptanceCriteria: ['Criteria 2'],
          dependencies: ['test-1']
        }
      ];

      getStore().loadIssues(newIssues);
      const store = getStore();

      expect(store.issues).toEqual(newIssues);
      expect(store.projectStatus.totalIssues).toBe(2);
      expect(store.projectStatus.completedIssues).toBe(1);
      expect(store.projectStatus.pending).toBe(1);
    });

    it('should handle empty issues list', () => {
      getStore().loadIssues([]);
      const store = getStore();

      expect(store.issues).toEqual([]);
      expect(store.projectStatus.totalIssues).toBe(0);
      expect(store.projectStatus.completedIssues).toBe(0);
    });
  });

  describe('executeIssue', () => {
    it('should execute a pending issue', async () => {
      const testIssue: Issue = {
        id: 'exec-test',
        title: 'Execute Test',
        description: 'Test execution',
        status: 'pending',
        acceptanceCriteria: ['Test criteria'],
        dependencies: []
      };

      getStore().loadIssues([testIssue]);
      await getStore().executeIssue('exec-test');
      
      const store = getStore();
      const updatedIssue = store.issues.find(i => i.id === 'exec-test');
      
      expect(updatedIssue?.status).toBe('completed');
      expect(updatedIssue?.output).toBeDefined();
      expect(store.output.length).toBeGreaterThan(0);
    });

    it('should not execute completed issues', async () => {
      const completedIssue: Issue = {
        id: 'completed-test',
        title: 'Completed Test',
        description: 'Already completed',
        status: 'completed',
        acceptanceCriteria: ['Done'],
        dependencies: []
      };

      getStore().loadIssues([completedIssue]);
      const outputBefore = getStore().output.length;

      await getStore().executeIssue('completed-test');

      expect(getStore().output.length).toBe(outputBefore);
    });

    it('should update execution state during execution', async () => {
      const testIssue: Issue = {
        id: 'progress-test',
        title: 'Progress Test',
        description: 'Test progress updates',
        status: 'pending',
        acceptanceCriteria: ['Test'],
        dependencies: []
      };

      getStore().loadIssues([testIssue]);
      
      // Start execution but don't await yet
      const executePromise = getStore().executeIssue('progress-test');
      
      // The execution should start synchronously, so we can check immediately
      const executingStore = getStore();
      expect(executingStore.execution.isRunning).toBe(true);
      expect(executingStore.execution.currentIssueId).toBe('progress-test');
      expect(executingStore.issues.find(i => i.id === 'progress-test')?.status).toBe('in-progress');

      // Wait for execution to complete
      await executePromise;
      
      const completedStore = getStore();
      expect(completedStore.execution.isRunning).toBe(false);
      expect(completedStore.execution.progress).toBe(100);
      expect(completedStore.issues.find(i => i.id === 'progress-test')?.status).toBe('completed');
    });
  });

  describe('executeAll', () => {
    it('should execute all pending and in-progress issues', async () => {
      const issues: Issue[] = [
        {
          id: 'all-1',
          title: 'All Test 1',
          description: 'Test 1',
          status: 'pending',
          acceptanceCriteria: ['Test'],
          dependencies: []
        },
        {
          id: 'all-2',
          title: 'All Test 2',
          description: 'Test 2',
          status: 'in-progress',
          acceptanceCriteria: ['Test'],
          dependencies: []
        },
        {
          id: 'all-3',
          title: 'All Test 3',
          description: 'Test 3',
          status: 'completed',
          acceptanceCriteria: ['Test'],
          dependencies: []
        }
      ];

      getStore().loadIssues(issues);
      await getStore().executeAll();
      
      const store = getStore();
      const pendingOrInProgress = store.issues.filter(
        i => i.status === 'pending' || i.status === 'in-progress'
      );
      expect(pendingOrInProgress.length).toBe(0);
      
      const completed = store.issues.filter(i => i.status === 'completed');
      expect(completed.length).toBe(3);
    });
  });

  describe('addOutput', () => {
    it('should add timestamped output messages', () => {
      getStore().addOutput('Test message');
      const store = getStore();

      expect(store.output.length).toBe(1);
      expect(store.output[0]).toContain('Test message');
      expect(store.output[0]).toMatch(/\[\d{1,2}:\d{2}:\d{2}\s*(AM|PM)?\]/);
    });

    it('should maintain output order', () => {
      getStore().addOutput('First');
      getStore().addOutput('Second');
      getStore().addOutput('Third');
      
      const store = getStore();
      expect(store.output.length).toBe(3);
      expect(store.output[0]).toContain('First');
      expect(store.output[1]).toContain('Second');
      expect(store.output[2]).toContain('Third');
    });
  });

  describe('updateProjectStatus', () => {
    it('should correctly count issues by status', () => {
      const issues: Issue[] = [
        { id: '1', title: 'Issue 1', description: '', status: 'completed', acceptanceCriteria: [], dependencies: [] },
        { id: '2', title: 'Issue 2', description: '', status: 'completed', acceptanceCriteria: [], dependencies: [] },
        { id: '3', title: 'Issue 3', description: '', status: 'in-progress', acceptanceCriteria: [], dependencies: [] },
        { id: '4', title: 'Issue 4', description: '', status: 'pending', acceptanceCriteria: [], dependencies: [] },
        { id: '5', title: 'Issue 5', description: '', status: 'failed', acceptanceCriteria: [], dependencies: [] }
      ];

      getStore().loadIssues(issues);
      getStore().updateProjectStatus();
      
      const store = getStore();
      expect(store.projectStatus.completedIssues).toBe(2);
      expect(store.projectStatus.inProgress).toBe(1);
      expect(store.projectStatus.pending).toBe(1);
      expect(store.projectStatus.failedIssues).toBe(1);
    });

    it('should update lastUpdated timestamp', () => {
      const beforeUpdate = new Date();
      
      getStore().updateProjectStatus();
      const store = getStore();

      expect(store.projectStatus.lastUpdated.getTime()).toBeGreaterThanOrEqual(beforeUpdate.getTime());
    });
  });

  describe('Error Simulation', () => {
    it('should successfully execute when error simulation is disabled', async () => {
      const testIssue: Issue = {
        id: 'no-error-test',
        title: 'No Error Test',
        description: 'Should succeed',
        status: 'pending',
        acceptanceCriteria: ['Test'],
        dependencies: []
      };

      getStore().loadIssues([testIssue]);
      
      // Ensure error simulation is disabled
      getStore().setErrorSimulation({ enabled: false });
      
      await getStore().executeIssue('no-error-test');
      
      const store = getStore();
      const issue = store.issues.find(i => i.id === 'no-error-test');
      expect(issue?.status).toBe('completed');
    });

    it('should fail when error simulation is enabled with 100% probability', async () => {
      const testIssue: Issue = {
        id: 'error-test',
        title: 'Error Test',
        description: 'Should fail',
        status: 'pending',
        acceptanceCriteria: ['Test'],
        dependencies: []
      };

      getStore().loadIssues([testIssue]);
      
      // Enable error simulation with 100% probability
      getStore().setErrorSimulation({ 
        enabled: true, 
        probability: 1.0,
        minProgressBeforeError: 0 
      });
      
      await expect(getStore().executeIssue('error-test')).rejects.toThrow('Execution failed');
      
      const store = getStore();
      const issue = store.issues.find(i => i.id === 'error-test');
      expect(issue?.status).toBe('failed');
      expect(issue?.output?.[0]).toContain('failed');
    });

    it('should respect minProgressBeforeError setting', async () => {
      const testIssue: Issue = {
        id: 'min-progress-test',
        title: 'Min Progress Test',
        description: 'Should fail after minimum progress',
        status: 'pending',
        acceptanceCriteria: ['Test'],
        dependencies: []
      };

      getStore().loadIssues([testIssue]);
      
      // Set error to occur after 30% progress
      getStore().setErrorSimulation({ 
        enabled: true, 
        probability: 1.0,
        minProgressBeforeError: 30 
      });
      
      await expect(getStore().executeIssue('min-progress-test')).rejects.toThrow();
      
      const store = getStore();
      // The error should have occurred after some progress was made
      // Progress updates in increments of 20, so we should have at least 20% progress
      expect(store.execution.progress).toBeGreaterThanOrEqual(20);
    });

    it('should update error simulation config', () => {
      getStore().setErrorSimulation({ enabled: true, probability: 0.5 });
      
      let store = getStore();
      expect(store.errorSimulation.enabled).toBe(true);
      expect(store.errorSimulation.probability).toBe(0.5);
      
      // Update only probability
      getStore().setErrorSimulation({ probability: 0.8 });
      
      store = getStore();
      expect(store.errorSimulation.enabled).toBe(true); // Should remain true
      expect(store.errorSimulation.probability).toBe(0.8);
    });
  });

  describe('executeAll with Error Simulation', () => {
    it('should handle failures in executeAll and report correctly', async () => {
      const issues: Issue[] = [
        {
          id: 'exec-all-success',
          title: 'Will Succeed',
          description: 'Test 1',
          status: 'pending',
          acceptanceCriteria: ['Test'],
          dependencies: []
        },
        {
          id: 'exec-all-fail',
          title: 'Will Fail',
          description: 'Test 2',
          status: 'pending',
          acceptanceCriteria: ['Test'],
          dependencies: []
        }
      ];

      getStore().loadIssues(issues);
      
      // Use deterministic approach: succeed first, fail second
      let callCount = 0;
      const originalExecuteIssue = getStore().executeIssue;
      useAgentStore.setState({
        executeIssue: async (issueId: string) => {
          callCount++;
          // First issue succeeds, second fails even with retries
          if (issueId === 'exec-all-fail') {
            getStore().setErrorSimulation({ 
              enabled: true, 
              probability: 1.0,
              minProgressBeforeError: 0 
            });
          } else {
            getStore().setErrorSimulation({ enabled: false });
          }
          return originalExecuteIssue.call(getStore(), issueId);
        }
      });
      
      await getStore().executeAll();
      
      const store = getStore();
      const successIssue = store.issues.find(i => i.id === 'exec-all-success');
      const failIssue = store.issues.find(i => i.id === 'exec-all-fail');
      
      expect(successIssue?.status).toBe('completed');
      expect(failIssue?.status).toBe('failed');
      
      // Check that summary output was added with correct counts
      const summaryOutput = store.output.find(o => o.includes('Execution complete:'));
      expect(summaryOutput).toBeDefined();
      expect(summaryOutput).toContain('1 succeeded');
      expect(summaryOutput).toContain('1 failed');
      
      // Verify retries happened (3 attempts total: 1 initial + 2 retries)
      expect(callCount).toBe(4); // 1 for success + 3 for fail (with retries)
    }, 15000);

    it('should successfully execute all issues when error simulation is disabled', async () => {
      const issues: Issue[] = [
        {
          id: 'no-error-1',
          title: 'No Error Test 1',
          description: 'Should succeed',
          status: 'pending',
          acceptanceCriteria: ['Test'],
          dependencies: []
        },
        {
          id: 'no-error-2',
          title: 'No Error Test 2',
          description: 'Should also succeed',
          status: 'pending',
          acceptanceCriteria: ['Test'],
          dependencies: []
        }
      ];

      getStore().loadIssues(issues);
      
      // Ensure error simulation is disabled
      getStore().setErrorSimulation({ 
        enabled: false,
        probability: 1.0,
        minProgressBeforeError: 0 
      });
      
      await getStore().executeAll();
      
      const store = getStore();
      const issue1 = store.issues.find(i => i.id === 'no-error-1');
      const issue2 = store.issues.find(i => i.id === 'no-error-2');
      
      // Both should succeed
      expect(issue1?.status).toBe('completed');
      expect(issue2?.status).toBe('completed');
      
      // Check summary output
      const summaryOutput = store.output.find(o => o.includes('Execution complete:'));
      expect(summaryOutput).toBeDefined();
      expect(summaryOutput).toContain('2 succeeded');
      expect(summaryOutput).toContain('0 failed');
    });
  });
});