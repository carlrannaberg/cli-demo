# Interactive Terminal UI for CLI Agent Application

**Status**: Draft  
**Authors**: Claude Code  
**Date**: 2025-07-07

## Overview

This specification outlines the implementation of a comprehensive interactive terminal UI for a CLI agent application. The UI will provide a modern, keyboard-driven interface for managing and executing agent tasks, inspired by contemporary terminal applications with rich interactivity.

## Background/Problem Statement

Currently, there is no interactive terminal interface for managing agent tasks. Users need a responsive, intuitive UI that allows them to:
- View and manage task queues
- Monitor real-time execution progress
- Navigate between different views efficiently
- Access functionality through keyboard shortcuts
- Receive immediate feedback through notifications

This feature addresses the need for a professional-grade terminal UI that enhances productivity and provides a superior developer experience.

## Goals

- Implement a multi-view terminal interface with navigation
- Provide real-time task execution monitoring
- Create an intuitive keyboard-driven experience
- Support state persistence and management
- Enable efficient task queue management
- Implement modern UI patterns (command palette, toasts, modals)

## Non-Goals

- Web-based interface (terminal only)
- Mouse/pointer interactions (keyboard-first design)
- Remote access capabilities
- Multi-user support
- External API endpoints

## Technical Dependencies

### External Libraries/Frameworks

1. **Ink v4.4.1** - React for interactive command-line apps
   - Core rendering engine for terminal UI
   - Component-based architecture
   - Hooks for terminal interactions

2. **React v18.2.0** - UI component framework
   - Required by Ink
   - Hooks and state management

3. **Zustand v4.4.0** - State management
   - Lightweight state management solution
   - Multiple stores for separation of concerns
   - TypeScript support

4. **Supporting Libraries**:
   - `ink-text-input@5.0.1` - Text input component
   - `ink-select-input@5.0.0` - Select/dropdown component  
   - `ink-spinner@5.0.0` - Loading indicators
   - `ink-table@3.0.0` - Table rendering
   - `@inkjs/ui@1.0.0` - Additional UI components

5. **Development Dependencies**:
   - `typescript@5.0.0` - Type safety
   - `tsx@4.0.0` - TypeScript execution
   - `@types/react@18.2.0` - React type definitions

## Detailed Design

### Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                   App Component                  │
│  ┌───────────────────────────────────────────┐  │
│  │              View Router                   │  │
│  │  ┌─────────┐ ┌──────────┐ ┌──────────┐  │  │
│  │  │Dashboard│ │Issue List│ │Execution │  │  │
│  │  └─────────┘ └──────────┘ └──────────┘  │  │
│  └───────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────┐  │
│  │             Status Bar                     │  │
│  └───────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────┐  │
│  │    Overlays (Command Palette, Help, etc)  │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
                          │
                          ▼
     ┌────────────────────────────────────┐
     │         State Management           │
     │  ┌────────────┐  ┌──────────────┐ │
     │  │AgentStore  │  │  UIStore     │ │
     │  └────────────┘  └──────────────┘ │
     └────────────────────────────────────┘
```

### State Management

#### AgentStore (Zustand)
```typescript
interface AgentState {
  issues: Issue[];
  projectStatus: ProjectStatus;
  currentExecution: number | null;
  executionOutput: string[];
  executionProgress: number;
  isExecuting: boolean;
  
  // Actions
  loadIssues: () => void;
  executeIssue: (number: number) => Promise<void>;
  executeAll: () => Promise<void>;
  addOutput: (line: string) => void;
}
```

#### UIStore (Zustand)
```typescript
interface UIState {
  activeView: 'dashboard' | 'issues' | 'execution' | 'config';
  showCommandPalette: boolean;
  showHelp: boolean;
  toast: Toast | null;
  
  // Actions
  setActiveView: (view: View) => void;
  toggleCommandPalette: () => void;
  toggleHelp: () => void;
  showToast: (message: string, type: ToastType) => void;
}
```

### Component Architecture

#### Core Components

1. **App Component**
   - Root component managing global keyboard shortcuts
   - View routing based on UIStore state
   - Overlay rendering (modals, toasts)

2. **Dashboard Component**
   - Project status overview
   - Quick action menu using SelectInput
   - Statistics display

3. **IssueList Component**
   - Filterable list of issues using TextInput
   - Keyboard navigation with arrow keys
   - Issue execution on Enter key

4. **ExecutionView Component**
   - Real-time output display using Static component
   - Progress indicator
   - Execution status

5. **StatusBar Component**
   - Current view indicator
   - Project statistics
   - Keyboard shortcut hints

#### Overlay Components

1. **CommandPalette**
   - Fuzzy search for commands
   - Quick navigation
   - Action execution

2. **HelpModal**
   - Keyboard shortcut reference
   - Navigation guide

3. **Toast**
   - Temporary notifications
   - Success/error/info states
   - Auto-dismiss after 3 seconds

### Keyboard Navigation

| Shortcut | Action |
|----------|--------|
| Ctrl+D | Navigate to Dashboard |
| Ctrl+I | Navigate to Issues |
| Ctrl+E | Navigate to Execution |
| Ctrl+K | Open Command Palette |
| Ctrl+H | Toggle Help |
| Ctrl+C | Exit Application |
| Escape | Close Modal/Go Back |
| ↑↓ | Navigate Lists |
| Enter | Execute Selected |
| Tab/Shift+Tab | Focus Navigation |

### Rendering Strategy

- Use Ink's `render()` for mounting the application
- Leverage `Static` component for execution logs
- Implement `useInput` hook for keyboard handling
- Use `Box` components with flexbox layout
- Apply border styles for visual hierarchy

## User Experience

### Workflow Example

1. **Launch Application**
   ```bash
   npm start
   ```
   - Dashboard appears showing project status
   - Status bar displays current stats

2. **Navigate to Issues**
   - Press `Ctrl+I` or use Command Palette
   - Filter issues by typing
   - Navigate with arrow keys

3. **Execute Issue**
   - Select issue and press Enter
   - Automatically switches to Execution view
   - Shows real-time progress and output

4. **Monitor Progress**
   - Toast notifications for status updates
   - Progress percentage in execution view
   - Status bar shows active execution

## Testing Strategy

### Unit Tests
- Store actions and state updates
- Component rendering with ink-testing-library
- Keyboard input handling
- State transitions

### Integration Tests
- Navigation between views
- Issue execution flow
- Command palette functionality
- Modal interactions

### E2E Tests
- Full user workflows
- Keyboard shortcut sequences
- State persistence
- Error scenarios

## Performance Considerations

- **Efficient Re-renders**: Use React.memo for static components
- **State Updates**: Batch updates in Zustand stores
- **Output Buffering**: Limit execution output to prevent memory issues
- **Keyboard Debouncing**: Debounce rapid keyboard inputs
- **Virtual Scrolling**: For large issue lists (future enhancement)

## Security Considerations

- **Input Sanitization**: Validate all user inputs
- **Command Injection**: Prevent malicious command execution
- **State Isolation**: Ensure stores don't leak sensitive data
- **File System Access**: Restrict to project directory only

## Documentation

### User Documentation
- Quick start guide
- Keyboard shortcut reference
- Common workflows
- Troubleshooting guide

### Developer Documentation
- Component API reference
- State management patterns
- Extension guide
- Contributing guidelines

## Implementation Phases

### Phase 1: MVP/Core Functionality
- Basic component structure
- Navigation between views
- Simple issue list and execution
- Core keyboard shortcuts
- Basic state management

### Phase 2: Enhanced Features
- Command palette implementation
- Toast notifications
- Help modal
- Issue filtering
- Progress tracking

### Phase 3: Polish and Optimization
- Performance optimizations
- Enhanced error handling
- Accessibility improvements
- Configuration management
- State persistence

## Open Questions

1. **State Persistence**: Should we persist UI state between sessions?
2. **Configuration**: How should user preferences be stored and managed?
3. **Theming**: Should we support custom color themes?
4. **Plugin System**: Should we design for extensibility?
5. **Error Recovery**: How to handle terminal resize and connection issues?

## References

- [Ink Documentation](https://github.com/vadimdemedes/ink)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Hooks in Ink](https://github.com/vadimdemedes/ink#hooks)
- [Terminal UI Best Practices](https://clig.dev/)
- [Keyboard Navigation Patterns](https://www.w3.org/WAI/ARIA/apg/patterns/)

## Appendix: Code Examples

### Basic Patterns

#### Basic Ink Component Pattern
```tsx
import { Box, Text, useInput } from 'ink';

const MyComponent: React.FC = () => {
  useInput((input, key) => {
    if (key.escape) {
      // Handle escape
    }
  });

  return (
    <Box flexDirection="column">
      <Text>Content</Text>
    </Box>
  );
};
```

#### Zustand Store Pattern
```typescript
const useStore = create<State>()((set, get) => ({
  // State
  value: 0,
  
  // Actions
  increment: () => set(state => ({ value: state.value + 1 })),
  
  // Async Actions
  fetchData: async () => {
    const data = await api.getData();
    set({ data });
  }
}));
```

### Complete Store Implementation

#### AgentStore Implementation
```typescript
const useAgentStore = create<AgentState>((set, get) => ({
  issues: [
    { number: 1, name: 'setup-database', status: 'completed', description: 'Initialize PostgreSQL database' },
    { number: 2, name: 'create-user-model', status: 'completed', description: 'Create user model and migrations' },
    { number: 3, name: 'add-authentication', status: 'pending', description: 'Implement JWT authentication' },
    { number: 4, name: 'create-api-endpoints', status: 'pending', description: 'Create REST API endpoints' },
    { number: 5, name: 'add-validation', status: 'pending', description: 'Add input validation middleware' },
  ],
  projectStatus: {
    totalIssues: 5,
    completed: 2,
    pending: 3,
    inProgress: 0
  },
  currentExecution: null,
  executionOutput: [],
  executionProgress: 0,
  isExecuting: false,
  
  loadIssues: () => {
    const issues = get().issues;
    const completed = issues.filter(i => i.status === 'completed').length;
    const pending = issues.filter(i => i.status === 'pending').length;
    const inProgress = issues.filter(i => i.status === 'in_progress').length;
    
    set({
      projectStatus: {
        totalIssues: issues.length,
        completed,
        pending,
        inProgress
      }
    });
  },
  
  executeIssue: async (number: number) => {
    set({ 
      isExecuting: true, 
      currentExecution: number,
      executionOutput: [],
      executionProgress: 0
    });
    
    // Update issue status
    const issues = get().issues.map(i => 
      i.number === number ? { ...i, status: 'in_progress' as const } : i
    );
    set({ issues });
    
    // Simulate execution with output
    const mockSteps = [
      'Analyzing issue requirements...',
      'Loading project context...',
      'Generating solution with Claude...',
      '```typescript',
      '// Generated code for issue',
      'export function implementation() {',
      '  console.log("Implementation complete");',
      '}',
      '```',
      'Writing files to disk...',
      'Running tests...',
      '✓ All tests passed',
      'Committing changes...',
      'Issue completed successfully!'
    ];
    
    for (let i = 0; i < mockSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 300));
      get().addOutput(mockSteps[i]);
      set({ executionProgress: Math.round((i + 1) / mockSteps.length * 100) });
    }
    
    // Mark as completed
    const updatedIssues = get().issues.map(i => 
      i.number === number ? { ...i, status: 'completed' as const } : i
    );
    set({ 
      issues: updatedIssues,
      isExecuting: false,
      currentExecution: null
    });
    get().loadIssues();
  },
  
  addOutput: (line: string) => {
    set(state => ({ executionOutput: [...state.executionOutput, line] }));
  }
}));
```

#### UIStore Implementation with Toast Management
```typescript
const useUIStore = create<UIState>((set) => ({
  activeView: 'dashboard',
  showCommandPalette: false,
  showHelp: false,
  toast: null,
  
  setActiveView: (view) => set({ activeView: view }),
  toggleCommandPalette: () => set(state => ({ showCommandPalette: !state.showCommandPalette })),
  toggleHelp: () => set(state => ({ showHelp: !state.showHelp })),
  showToast: (message, type) => {
    set({ toast: { message, type } });
    setTimeout(() => set({ toast: null }), 3000);
  },
  hideToast: () => set({ toast: null })
}));
```

### Component Examples

#### Dashboard Component with SelectInput
```tsx
const Dashboard: React.FC = () => {
  const { projectStatus, executeIssue, executeAll } = useAgentStore();
  const { showToast } = useUIStore();
  
  const menuItems = [
    { label: 'Run Next Issue', value: 'run-next' },
    { label: 'Run All Issues', value: 'run-all' },
    { label: 'View Issues', value: 'issues' },
    { label: 'Configuration', value: 'config' }
  ];
  
  const handleSelect = async (item: { value: string }) => {
    switch (item.value) {
      case 'run-next':
        const nextIssue = useAgentStore.getState().issues.find(i => i.status === 'pending');
        if (nextIssue) {
          showToast(`Executing issue #${nextIssue.number}`, 'info');
          await executeIssue(nextIssue.number);
          showToast('Issue completed!', 'success');
        } else {
          showToast('No pending issues', 'error');
        }
        break;
      case 'run-all':
        showToast('Running all pending issues...', 'info');
        await executeAll();
        showToast('All issues completed!', 'success');
        break;
      case 'issues':
        useUIStore.getState().setActiveView('issues');
        break;
    }
  };
  
  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold color="cyan">🚀 Dashboard</Text>
      </Box>
      
      <Box flexDirection="row" marginBottom={2}>
        <Box width="50%" flexDirection="column">
          <Text bold underline marginBottom={1}>Project Status</Text>
          <Text>Total Issues: {projectStatus.totalIssues}</Text>
          <Text color="green">Completed: {projectStatus.completed}</Text>
          <Text color="yellow">Pending: {projectStatus.pending}</Text>
          <Text color="blue">In Progress: {projectStatus.inProgress}</Text>
        </Box>
        
        <Box width="50%" flexDirection="column">
          <Text bold underline marginBottom={1}>Quick Stats</Text>
          <Text>Progress: {Math.round((projectStatus.completed / projectStatus.totalIssues) * 100)}%</Text>
          <Text>Provider: Claude</Text>
          <Text>Auto-commit: Enabled</Text>
        </Box>
      </Box>
      
      <Box flexDirection="column">
        <Text bold marginBottom={1}>Quick Actions:</Text>
        <SelectInput items={menuItems} onSelect={handleSelect} />
      </Box>
    </Box>
  );
};
```

#### IssueList with Filtering and Keyboard Navigation
```tsx
const IssueList: React.FC = () => {
  const [filter, setFilter] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { issues, executeIssue } = useAgentStore();
  const { showToast } = useUIStore();
  
  const filteredIssues = issues.filter(issue =>
    issue.name.toLowerCase().includes(filter.toLowerCase())
  );
  
  useInput(async (input, key) => {
    if (key.return && filteredIssues[selectedIndex]) {
      const issue = filteredIssues[selectedIndex];
      if (issue.status === 'completed') {
        showToast('Issue already completed', 'error');
      } else {
        showToast(`Executing issue #${issue.number}`, 'info');
        await executeIssue(issue.number);
        showToast('Issue completed!', 'success');
      }
    }
    if (key.upArrow) {
      setSelectedIndex(Math.max(0, selectedIndex - 1));
    }
    if (key.downArrow) {
      setSelectedIndex(Math.min(filteredIssues.length - 1, selectedIndex + 1));
    }
  });
  
  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold>Filter: </Text>
        <TextInput
          value={filter}
          onChange={setFilter}
          placeholder="Type to filter issues..."
        />
      </Box>
      
      <Box flexDirection="column" marginBottom={1}>
        <Static items={filteredIssues}>
          {(issue, index) => (
            <Box key={issue.number}>
              <Text
                color={selectedIndex === index ? 'blue' : undefined}
                backgroundColor={selectedIndex === index ? 'white' : undefined}
              >
                {issue.status === 'completed' ? '✓' : '○'} #{issue.number} {issue.name}
                <Text dim> - {issue.description}</Text>
              </Text>
            </Box>
          )}
        </Static>
      </Box>
      
      <Box>
        <Text dim>
          [↑↓] Navigate | [Enter] Execute | [Esc] Back
        </Text>
      </Box>
    </Box>
  );
};
```

#### ExecutionView with Real-time Output
```tsx
const ExecutionView: React.FC = () => {
  const { isExecuting, currentExecution, executionOutput, executionProgress, issues } = useAgentStore();
  const currentIssue = issues.find(i => i.number === currentExecution);
  
  return (
    <Box flexDirection="column" padding={1} height="100%">
      <Box borderStyle="round" borderColor="cyan" paddingX={1} marginBottom={1}>
        <Text bold>Execution Monitor</Text>
        <Spacer />
        {isExecuting && <Spinner type="dots" />}
        <Text> Provider: Claude</Text>
      </Box>
      
      {currentIssue && (
        <Box marginBottom={1}>
          <Text>Issue: </Text>
          <Text color="yellow">#{currentIssue.number} {currentIssue.name}</Text>
          <Spacer />
          <Text dim>{executionProgress}%</Text>
        </Box>
      )}
      
      <Box flexDirection="column" borderStyle="single" borderColor="gray" padding={1} height={15}>
        <Static items={executionOutput}>
          {(line, i) => (
            <Text key={i} color={line.startsWith('✓') ? 'green' : undefined}>
              {line}
            </Text>
          )}
        </Static>
      </Box>
    </Box>
  );
};
```

#### Command Palette with Fuzzy Search
```tsx
const CommandPalette: React.FC = () => {
  const [query, setQuery] = useState('');
  const { showCommandPalette, toggleCommandPalette, setActiveView } = useUIStore();
  
  if (!showCommandPalette) return null;
  
  const commands = [
    { label: 'Go to Dashboard', value: 'dashboard' },
    { label: 'Go to Issues', value: 'issues' },
    { label: 'Go to Execution', value: 'execution' },
    { label: 'Run All Issues', value: 'run-all' },
    { label: 'Show Help', value: 'help' }
  ];
  
  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );
  
  const handleSelect = async (item: { value: string }) => {
    toggleCommandPalette();
    setQuery('');
    
    switch (item.value) {
      case 'dashboard':
      case 'issues':
      case 'execution':
        setActiveView(item.value as any);
        break;
      case 'run-all':
        await useAgentStore.getState().executeAll();
        break;
      case 'help':
        useUIStore.getState().toggleHelp();
        break;
    }
  };
  
  return (
    <Box
      position="absolute"
      width="60%"
      left="20%"
      top={2}
      flexDirection="column"
      borderStyle="round"
      borderColor="magenta"
      padding={1}
    >
      <Box marginBottom={1}>
        <Text>Command: </Text>
        <TextInput
          value={query}
          onChange={setQuery}
          placeholder="Type to search..."
          focus
        />
      </Box>
      <SelectInput items={filteredCommands} onSelect={handleSelect} />
    </Box>
  );
};
```

#### Toast Notifications
```tsx
const Toast: React.FC = () => {
  const { toast } = useUIStore();
  
  if (!toast) return null;
  
  const colors = {
    success: 'green',
    error: 'red',
    info: 'blue'
  };
  
  return (
    <Box
      position="absolute"
      right={2}
      top={2}
      borderStyle="round"
      borderColor={colors[toast.type]}
      paddingX={1}
    >
      <Text color={colors[toast.type]}>{toast.message}</Text>
    </Box>
  );
};
```

#### Main App Component with Global Keyboard Handling
```tsx
const App: React.FC = () => {
  const { activeView, toggleCommandPalette, toggleHelp, setActiveView } = useUIStore();
  const { exit } = useApp();
  
  useEffect(() => {
    useAgentStore.getState().loadIssues();
  }, []);
  
  useInput((input, key) => {
    // Global shortcuts
    if (key.ctrl && input === 'c') {
      exit();
    }
    
    if (key.ctrl && input === 'k') {
      toggleCommandPalette();
    }
    
    if (key.ctrl && input === 'h') {
      toggleHelp();
    }
    
    if (key.escape) {
      if (useUIStore.getState().showHelp) {
        toggleHelp();
      } else if (useUIStore.getState().showCommandPalette) {
        toggleCommandPalette();
      } else if (activeView !== 'dashboard') {
        setActiveView('dashboard');
      }
    }
    
    // View shortcuts
    if (key.ctrl) {
      switch (input) {
        case 'd': setActiveView('dashboard'); break;
        case 'i': setActiveView('issues'); break;
        case 'e': setActiveView('execution'); break;
      }
    }
  });
  
  return (
    <Box flexDirection="column" height="100%">
      <Box flexDirection="column" flexGrow={1}>
        {activeView === 'dashboard' && <Dashboard />}
        {activeView === 'issues' && <IssueList />}
        {activeView === 'execution' && <ExecutionView />}
      </Box>
      
      <StatusBar />
      
      {/* Overlays */}
      <CommandPalette />
      <HelpModal />
      <Toast />
    </Box>
  );
};
```

### Entry Point and Environment Check
```typescript
#!/usr/bin/env node

// Entry point
if (process.stdout.isTTY) {
  render(<App />);
} else {
  console.log('This demo requires an interactive terminal. Please run in a TTY environment.');
  process.exit(1);
}
```