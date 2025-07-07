# Architecture Overview

This document describes the architecture of the CLI Agent Demo application, a terminal-based UI for managing AI agent tasks.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Terminal/Console                      │
├─────────────────────────────────────────────────────────┤
│                     Ink (React)                          │
├─────────────────────────────────────────────────────────┤
│                    Components                            │
│  ┌─────────┐ ┌──────────┐ ┌─────────┐ ┌──────────┐    │
│  │   App   │ │Dashboard │ │IssueList│ │Execution │    │
│  └─────────┘ └──────────┘ └─────────┘ └──────────┘    │
├─────────────────────────────────────────────────────────┤
│                  State Management                        │
│  ┌─────────┐ ┌──────────┐ ┌─────────┐ ┌──────────┐    │
│  │UIStore  │ │AgentStore│ │ConfigStore│ │  ...    │    │
│  └─────────┘ └──────────┘ └─────────┘ └──────────┘    │
├─────────────────────────────────────────────────────────┤
│                    Utilities                             │
│  ┌────────────┐ ┌─────────────┐ ┌──────────────┐      │
│  │KeyboardUtils│ │ConfigManager│ │    Logger    │      │
│  └────────────┘ └─────────────┘ └──────────────┘      │
└─────────────────────────────────────────────────────────┘
```

## Core Technologies

### Ink (React for CLI)
- Terminal rendering using React components
- Handles terminal-specific concerns (cursor, colors, layout)
- Provides hooks for keyboard input and terminal capabilities

### TypeScript
- Full type safety across the application
- Strict mode enabled for better error catching
- Interface-based design for extensibility

### Zustand
- Lightweight state management solution
- No boilerplate, direct state mutations
- TypeScript support out of the box
- Devtools integration for debugging

## Component Architecture

### Component Hierarchy

```
App
├── Dashboard
│   ├── StatsCard
│   ├── RecentActivity
│   └── QuickActions
├── IssueList
│   ├── IssueItem
│   └── IssueDetail
├── ExecutionView
│   ├── OutputPane
│   └── ControlBar
├── ConfigView
│   └── ConfigEditor
├── StatusBar
├── CommandPalette
├── HelpModal
└── Toast
```

### Component Principles

1. **Single Responsibility**: Each component has one clear purpose
2. **Props Interface**: All components have typed props
3. **Hooks for Logic**: Complex logic extracted to custom hooks
4. **Composition**: Favor composition over inheritance

### Key Components

#### App Component (`src/components/App.tsx`)
- Root component managing global state
- Handles view routing
- Manages global keyboard shortcuts
- Renders overlay components (modals, toasts)

#### Dashboard (`src/components/Dashboard.tsx`)
- Overview of agent status and statistics
- Quick navigation to other views
- Real-time status updates

#### IssueList (`src/components/IssueList.tsx`)
- Displays available issues/tasks
- Keyboard navigation with j/k or arrow keys
- Detail view for selected issues

#### ExecutionView (`src/components/ExecutionView.tsx`)
- Shows agent execution output
- Controls for starting/stopping execution
- Output buffering and scrolling

## State Management

### Store Architecture

The application uses Zustand for state management with the following stores:

#### UIStore (`src/stores/uiStore.ts`)
```typescript
interface UIState {
  activeView: 'overview' | 'issues' | 'execution' | 'config';
  isCommandPaletteOpen: boolean;
  isHelpOpen: boolean;
  toasts: Toast[];
  
  // Actions
  setActiveView: (view: ViewType) => void;
  toggleCommandPalette: () => void;
  toggleHelp: () => void;
  showToast: (message: string, type: ToastType) => void;
}
```

#### AgentStore (`src/stores/agentStore.ts`)
```typescript
interface AgentState {
  status: 'idle' | 'running' | 'error';
  currentIssue: Issue | null;
  executionOutput: string[];
  progress: number;
  
  // Actions
  startExecution: (issue: Issue) => void;
  stopExecution: () => void;
  updateProgress: (progress: number) => void;
  appendOutput: (output: string) => void;
}
```

#### ConfigStore (`src/stores/configStore.ts`)
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
```

### State Management Principles

1. **Flat State Structure**: Avoid deeply nested state
2. **Derived State**: Calculate values from state when possible
3. **Actions as Methods**: Store actions alongside state
4. **TypeScript Interfaces**: Full typing for all stores

## Keyboard Navigation

### Global Shortcuts
- Managed by the App component
- Uses Ink's `useInput` hook
- Debounced to prevent rapid firing

### View-Specific Shortcuts
- Each view component manages its own shortcuts
- Can override or extend global shortcuts
- Shortcuts documented in HelpModal

### Keyboard Utility (`src/utils/keyboardUtils.ts`)
- `createKeyHandler`: Factory for keyboard handlers
- `debounce`: Prevents rapid key firing
- `isModifierKey`: Detects modifier key combinations

## Configuration System

### Configuration Storage
- Stored in `~/.cli-agent/config.json`
- Automatic creation on first run
- Validation and default merging

### Configuration Options
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

### Loading Strategy
1. Check for existing config file
2. Merge with defaults for missing fields
3. Save merged config back
4. Watch for external changes (planned)

## Rendering Strategy

### Terminal Constraints
- Limited colors (16/256/truecolor)
- Fixed character grid
- No mouse support (keyboard only)
- Variable terminal sizes

### Layout Management
- Flexbox-based layout using Ink
- Responsive to terminal resize
- Scrollable areas for long content
- Focus management for navigation

### Performance Optimizations
- Virtual scrolling for long lists
- Output buffering for execution view
- Debounced keyboard input
- Memoized component rendering

## Error Handling

### Error Boundaries
- Catch component errors
- Display user-friendly messages
- Allow recovery without restart

### Store Error Handling
- Each store manages its own errors
- Error state included in store
- Toast notifications for user feedback

### Async Operation Handling
- Loading states for async operations
- Timeout handling for long operations
- Graceful degradation on failure

## Testing Strategy

### Unit Tests
- Component testing with React Testing Library
- Store testing with Zustand's testing utilities
- Utility function testing with Jest

### Integration Tests
- Full app flow testing
- Keyboard navigation testing
- State persistence testing

### E2E Tests
- Terminal output verification
- Multi-view navigation
- Configuration changes

## Extension Points

### Adding New Views
1. Create component in `src/components/`
2. Add view type to `ViewType` union
3. Update routing in App component
4. Add navigation shortcut

### Adding New Stores
1. Create store in `src/stores/`
2. Define TypeScript interface
3. Export from `src/stores/index.ts`
4. Use in components as needed

### Custom Themes
1. Define theme in configuration
2. Create theme provider component
3. Apply theme classes/styles
4. Update ConfigView for selection

## Build and Deployment

### Build Process
1. TypeScript compilation
2. Bundle with included dependencies
3. Generate source maps for debugging
4. Output to `dist/` directory

### Deployment Considerations
- Node.js 16+ requirement
- Terminal compatibility testing
- Cross-platform path handling
- Performance profiling

## Future Enhancements

### Planned Features
- Plugin system for extensibility
- Remote agent support
- Multi-window layout
- Mouse support (where available)
- Theme customization

### Performance Improvements
- Lazy loading for views
- Worker threads for heavy operations
- Incremental rendering
- Memory usage optimization

### Developer Experience
- Hot module replacement
- Better debugging tools
- Component playground
- Documentation generator