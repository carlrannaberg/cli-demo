# API Reference

This document provides a comprehensive API reference for the CLI Agent Demo application.

## Components

### App

The root component that manages the application's global state and routing.

```typescript
const App: React.FC
```

**Props**: None (root component)

**Keyboard Shortcuts**:
- `Ctrl+C`: Exit application
- `Ctrl+H`: Toggle help modal
- `Ctrl+K`: Toggle command palette
- `Ctrl+I`: Navigate to issues view
- `Ctrl+D`: Navigate to dashboard
- `Ctrl+E`: Navigate to execution view
- `Escape`: Return to dashboard

### Dashboard

Displays an overview of the agent's status and recent activity.

```typescript
interface DashboardProps {
  // No props - uses store directly
}

const Dashboard: React.FC<DashboardProps>
```

**Store Dependencies**:
- `useAgentStore`: For agent status and statistics
- `useUIStore`: For navigation actions

### IssueList

Shows a list of available issues with keyboard navigation.

```typescript
interface IssueListProps {
  // No props - uses store directly
}

const IssueList: React.FC<IssueListProps>
```

**Keyboard Shortcuts**:
- `↑/↓` or `j/k`: Navigate through issues
- `Enter`: View issue details
- `Space`: Toggle issue selection
- `r`: Refresh issues list

### ExecutionView

Displays agent execution output with controls.

```typescript
interface ExecutionViewProps {
  // No props - uses store directly
}

const ExecutionView: React.FC<ExecutionViewProps>
```

**Features**:
- Real-time output streaming
- Scrollable output buffer
- Start/stop controls
- Progress indication

### StatusBar

Shows current application status and helpful hints.

```typescript
interface StatusBarProps {
  // No props - uses store directly
}

const StatusBar: React.FC<StatusBarProps>
```

**Displays**:
- Current view
- Agent status
- Keyboard shortcuts hint
- System messages

### CommandPalette

Quick command access overlay.

```typescript
interface CommandPaletteProps {
  // No props - uses store directly
}

const CommandPalette: React.FC<CommandPaletteProps>
```

**Commands**:
- View navigation
- Agent actions
- Configuration
- Help

### Toast

Notification system for user feedback.

```typescript
interface ToastProps {
  // No props - uses store directly
}

const Toast: React.FC<ToastProps>
```

**Toast Types**:
- `info`: General information
- `success`: Successful operations
- `error`: Error messages
- `warning`: Warning messages

## Stores

### UIStore

Manages UI state including active view, modals, and notifications.

```typescript
interface UIState {
  activeView: ViewType;
  isCommandPaletteOpen: boolean;
  isHelpOpen: boolean;
  toasts: Toast[];
  
  // Actions
  setActiveView: (view: ViewType) => void;
  toggleCommandPalette: () => void;
  toggleHelp: () => void;
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  dismissToast: (id: string) => void;
}

const useUIStore: () => UIState
```

**Usage**:
```typescript
const { activeView, setActiveView } = useUIStore();
```

### AgentStore

Manages agent execution state and output.

```typescript
interface AgentState {
  status: AgentStatus;
  currentIssue: Issue | null;
  issues: Issue[];
  executionOutput: string[];
  progress: number;
  
  // Actions
  setStatus: (status: AgentStatus) => void;
  setCurrentIssue: (issue: Issue | null) => void;
  setIssues: (issues: Issue[]) => void;
  appendOutput: (output: string) => void;
  clearOutput: () => void;
  updateProgress: (progress: number) => void;
  startExecution: (issue: Issue) => void;
  stopExecution: () => void;
}

const useAgentStore: () => AgentState
```

### ConfigStore

Manages application configuration with persistence.

```typescript
interface ConfigState {
  config: Configuration;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadConfig: () => Promise<void>;
  saveConfig: () => Promise<void>;
  updateConfig: (updates: Partial<Configuration>) => void;
  resetToDefaults: () => void;
}

const useConfigStore: () => ConfigState
```

**Configuration Interface**:
```typescript
interface Configuration {
  defaultView: ViewType;
  colorTheme: string;
  autoCommit: boolean;
  provider: string;
  keyboardShortcuts: KeyboardShortcuts;
  outputBufferSize: number;
  maxConcurrentExecutions: number;
}
```

## Types

### Core Types

```typescript
// View types
type ViewType = 'overview' | 'issues' | 'execution' | 'config';

// Agent status
type AgentStatus = 'idle' | 'running' | 'error' | 'success';

// Toast types
type ToastType = 'info' | 'success' | 'error' | 'warning';

// Issue interface
interface Issue {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

// Toast interface
interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

// Keyboard shortcuts
interface KeyboardShortcuts {
  toggleCommandPalette: string;
  toggleHelp: string;
  navigateUp: string;
  navigateDown: string;
  select: string;
  back: string;
}
```

## Utilities

### Keyboard Utils

```typescript
// Debounce function for keyboard input
function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): DebouncedFunction<T>

// Check if key combination includes modifiers
function isModifierKey(input: string, key: KeyMeta): boolean

// Create a keyboard handler with key mappings
function createKeyHandler(
  handlers: Record<string, (input: string, key: KeyMeta) => void>,
  debounceDelay?: number
): (input: string, key: KeyMeta) => void

// Key metadata interface
interface KeyMeta {
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
}
```

## Hooks

### Custom Hooks

```typescript
// Use keyboard navigation in a list
function useListNavigation<T>(
  items: T[],
  onSelect: (item: T) => void
): {
  selectedIndex: number;
  selectedItem: T | null;
  handleKeyPress: (input: string, key: KeyMeta) => void;
}

// Use async operation with loading state
function useAsync<T>(
  asyncFunction: () => Promise<T>
): {
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: () => Promise<void>;
}
```

## Configuration

### Default Configuration

```typescript
const DEFAULT_CONFIG: Configuration = {
  defaultView: 'overview',
  colorTheme: 'default',
  autoCommit: false,
  provider: 'anthropic',
  keyboardShortcuts: {
    toggleCommandPalette: 'ctrl+p',
    toggleHelp: '?',
    navigateUp: 'up',
    navigateDown: 'down',
    select: 'enter',
    back: 'escape'
  },
  outputBufferSize: 1000,
  maxConcurrentExecutions: 1
};
```

### Configuration File Location

- **Unix/Linux/macOS**: `~/.cli-agent/config.json`
- **Windows**: `%USERPROFILE%\.cli-agent\config.json`

## Events

### Store Events

Stores emit changes automatically when state updates. Components re-render based on the specific state they consume.

```typescript
// Subscribe to store changes
const unsubscribe = useUIStore.subscribe(
  (state) => state.activeView,
  (activeView) => {
    console.log('Active view changed:', activeView);
  }
);
```

### Keyboard Events

Keyboard events are handled through Ink's `useInput` hook:

```typescript
useInput((input, key) => {
  if (key.ctrl && input === 'c') {
    // Handle Ctrl+C
  }
});
```

## Error Handling

### Error States

Each store maintains its own error state:

```typescript
// In store
interface StoreWithError {
  error: string | null;
  setError: (error: string | null) => void;
}

// In component
const { error } = useStore();
if (error) {
  return <Text color="red">Error: {error}</Text>;
}
```

### Error Recovery

```typescript
// Retry pattern
const retry = async () => {
  setError(null);
  try {
    await someAsyncOperation();
  } catch (err) {
    setError(err.message);
  }
};
```

## Testing

### Component Testing

```typescript
import { render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

// Test component
test('Dashboard renders correctly', () => {
  const { getByText } = render(<Dashboard />);
  expect(getByText('Dashboard')).toBeInTheDocument();
});

// Test store
test('UIStore toggles command palette', () => {
  const { result } = renderHook(() => useUIStore());
  
  act(() => {
    result.current.toggleCommandPalette();
  });
  
  expect(result.current.isCommandPaletteOpen).toBe(true);
});
```

### Mocking Stores

```typescript
// Mock store for testing
const mockUIStore = {
  activeView: 'overview',
  setActiveView: jest.fn(),
  // ... other properties
};

jest.mock('../stores/uiStore', () => ({
  useUIStore: () => mockUIStore
}));
```