# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- REPL-based architecture for autonomous coding sessions
- Slash command system with intelligent autocompletion (`/command`)
- Command aliases for quick access (e.g., `/d` for `/demo`)
- Session management (start, stop, pause, resume)
- Real-time task execution monitoring
- Streaming updates with circular buffers (10k+ events)
- Demo mode with 10 autonomous coding tasks
- Comprehensive error handling with ErrorBoundary
- Error logging system with timestamped log files
- Claude-inspired theme system with semantic colors
- ASCII art logo on startup
- ExecutionMonitor component for live statistics
- StreamingView component for real-time updates
- Enhanced status bar with inline toast notifications
- Light theme support
- Performance optimizations with circular buffers
- TypeScript strict mode compliance

### Changed
- Default view changed from dashboard to REPL
- Toast notifications moved to status bar (no more UI disruption)
- Enhanced theme system with nothingatall-inspired colors
- Improved command palette with better visual hierarchy
- Updated all keyboard shortcuts documentation
- Border styles changed to rounded for modern aesthetic

### Fixed
- Empty slash command execution bug
- Toast notifications clearing the header
- React hooks dependency warnings
- ESLint configuration for strict compliance
- ts-jest deprecation warning

### Technical
- Added sessionStore for persistent state management
- Implemented circular buffers for performance
- Added comprehensive TypeScript types
- Enhanced error recovery mechanisms
- Improved component memoization

## [1.0.0] - Initial Release

### Added
- Basic terminal UI with Ink
- Multiple views (Dashboard, Issues, Execution, Config)
- Zustand state management
- Command palette (Ctrl+K)
- Help modal (Ctrl+H)
- Basic navigation
- TypeScript support
- Jest testing setup