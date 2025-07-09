# Agent Instructions

This file gives guidance to agentic coding tools on codebase structure, build/test commands, architecture, etc.

## Project Context
Interactive terminal UI application for autonomous coding sessions, featuring a REPL interface with real-time monitoring capabilities. Built with Ink (React for CLI), TypeScript, and Zustand for state management.

## Technology Stack
- Node.js 16+
- TypeScript 5.0 (strict mode)
- React 18.2.0
- Ink 4.4.1 (React for CLI)
- Zustand 4.4.0 (State Management)
- Jest (Testing)
- Various Ink UI components (ink-text-input, etc.)

## Architecture Overview
- **REPL-Based**: Primary interface is a command-line REPL with slash commands
- **Session Management**: Persistent sessions for long-running autonomous coding
- **Error Handling**: Comprehensive error boundaries and logging system
- **Streaming Updates**: Real-time task execution monitoring
- **Theme System**: Claude-inspired theming with dark/light modes

## Coding Standards
- TypeScript strict mode enabled
- React functional components with hooks
- ESModules (type: "module" in package.json)
- No unused locals or parameters (`/^_/u` for allowed unused vars)
- Consistent file naming (camelCase for utils, PascalCase for components)
- Required semicolons
- Single quotes for strings
- 2-space indentation
- Max line length: 100 characters

## Build and Test Commands
- `npm start` - Run the application
- `npm run dev` - Run in watch mode for development
- `npm run build` - Build the TypeScript project
- `npm run typecheck` - Run TypeScript type checking
- `npm run lint` - Run ESLint
- `npm test` - Run Jest tests
- `npm test -- --watch` - Run tests in watch mode
- `npm test -- --coverage` - Run tests with coverage

## Key Features to Maintain
1. **Slash Commands**: All commands use `/` prefix with autocompletion
2. **Error Boundaries**: Wrap all major components for graceful error handling
3. **Session State**: Maintain persistent session state across operations
4. **Theme Consistency**: Use theme colors from useTheme() hook
5. **Performance**: Use circular buffers for event streaming (10k+ events)

## Project Structure
```
src/
├── components/          # UI components
│   ├── REPL.tsx        # Main REPL interface
│   ├── ErrorBoundary.tsx # Error handling wrapper
│   ├── Logo.tsx        # ASCII art logo
│   └── ...
├── stores/             # Zustand state stores
│   ├── sessionStore.ts # Session management
│   ├── uiStore.ts      # UI state
│   └── ...
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
│   ├── errorLogger.ts  # Error logging system
│   └── ...
├── constants/          # Constants and theme
│   ├── theme.ts        # Theme definitions
│   └── figures.ts      # Unicode characters
├── hooks/              # Custom React hooks
└── index.tsx           # Application entry point
```

## Testing Guidelines
- Test files go in `src/__tests__/` with `.test.ts` extension
- Mock external dependencies (file system, etc.)
- Focus on store logic and utility functions
- UI components are tested manually due to Ink limitations

## Common Patterns
1. **Error Handling**: Use try-catch with errorLogger.logError()
2. **Async Operations**: Show loading states and handle errors
3. **User Feedback**: Use toast notifications for status updates
4. **Command Processing**: Parse with slash prefix, resolve aliases
5. **Theme Usage**: Always use theme colors, never hardcode

## Performance Considerations
- Circular buffers for event storage (max 10k events)
- Debounced file operations for config saving
- React.memo for expensive components
- useMemo/useCallback for computed values

## Future Enhancements
- WebSocket support for real-time updates
- Plugin system for custom commands
- Multi-session management
- Export session history
- Custom theme creation
