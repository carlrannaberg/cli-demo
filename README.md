# CLI Demo - Autonomous Coding REPL

An interactive terminal UI for autonomous coding sessions, built with Ink (React for CLI) and TypeScript. This demo showcases long-running autonomous development workflows with real-time monitoring and control.

## Features

### Core Capabilities
- **REPL Interface**: Command-line interface for autonomous coding sessions with slash command autocompletion
- **Session Management**: Start, stop, pause, and resume coding sessions with persistent state
- **Real-time Monitoring**: Live statistics, task progress, and execution streaming
- **Error Handling**: Comprehensive error boundaries, logging, and recovery mechanisms
- **Multiple Views**: REPL, Dashboard, Issues, Execution, and Configuration views

### UI/UX Features
- **Slash Commands**: Type `/` for intelligent command autocompletion with aliases
- **Theme System**: Beautiful Claude-inspired theme with semantic colors
- **Command Palette**: Quick access to commands with `Ctrl+K`
- **Toast Notifications**: Inline status updates in the status bar
- **Keyboard Navigation**: Efficient navigation with customizable shortcuts
- **ASCII Art Logo**: Professional branding on startup

## Installation

### Prerequisites

- Node.js 16 or higher
- npm or yarn

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/cli-demo.git
cd cli-demo

# Install dependencies
npm install

# Build the project
npm run build

# Run the application
npm start
```

### Development Mode

For development with hot reloading:

```bash
npm run dev
```

## Usage

### Quick Start

The application starts in REPL mode. Try these commands:

```bash
# Start a demo session
/demo

# Begin autonomous execution
/auto-execute

# Monitor execution statistics
/monitor

# See all available commands
/help
```

### Slash Commands

All commands use the `/` prefix with intelligent autocompletion:

- **`/demo`** (`/d`): Start a demo session with autonomous coding tasks
- **`/start [sessionId]`** (`/s`): Start a new coding session
- **`/stop`**: Stop the current session
- **`/status`** (`/st`): Show session status
- **`/monitor`** (`/m`): Display execution statistics
- **`/auto-execute`** (`/auto`, `/ae`): Start autonomous execution
- **`/pause`** (`/p`): Pause autonomous execution
- **`/resume`** (`/r`): Resume autonomous execution
- **`/tasks`** (`/t`): List available tasks
- **`/task <name>`** (`/exec`): Execute a specific task
- **`/clear`** (`/c`): Clear output
- **`/help`** (`/h`): Show help

### Global Shortcuts

- **`Ctrl+R`**: Switch to REPL view
- **`Ctrl+D`**: Go to Dashboard
- **`Ctrl+I`**: Go to Issues list
- **`Ctrl+E`**: Go to Execution view
- **`Ctrl+K`**: Open Command Palette
- **`Ctrl+H`**: Open Help Modal
- **`Ctrl+L`**: Clear REPL output
- **`Ctrl+C`**: Exit the application
- **`Escape`**: Return to previous view

### REPL Navigation

- **`/`**: Show command suggestions
- **`↑/↓`**: Navigate command history or suggestions
- **`Tab`**: Complete command
- **`Enter`**: Execute command
- **`Escape`**: Cancel suggestions

## Configuration

The application stores configuration in `~/.cli-agent/config.json`. You can customize:

```json
{
  "defaultView": "repl",
  "colorTheme": "dark",
  "autoCommit": false,
  "provider": "anthropic",
  "keyboardShortcuts": {
    "toggleCommandPalette": "ctrl+k",
    "toggleHelp": "ctrl+h",
    "navigateUp": "up",
    "navigateDown": "down",
    "select": "enter",
    "back": "escape"
  },
  "outputBufferSize": 5000,
  "maxConcurrentExecutions": 3
}
```

### Configuration Options

- **`defaultView`**: The view to show on startup (`repl`, `overview`, `issues`, `execution`, `config`)
- **`colorTheme`**: Color theme for the UI (`dark`, `light`)
- **`autoCommit`**: Whether to automatically commit changes
- **`provider`**: AI provider to use (`anthropic`, `openai`, etc.)
- **`outputBufferSize`**: Maximum lines to keep in execution output (default: 5000)
- **`maxConcurrentExecutions`**: Number of parallel executions allowed

## Architecture

The application follows a REPL-based architecture optimized for autonomous coding:

### Core Components
- **REPL Interface**: Command-driven interaction with session management
- **Session Store**: Persistent state for long-running coding sessions
- **Streaming Engine**: Real-time event streaming with circular buffers
- **Error Handling**: Comprehensive error boundaries and recovery
- **Theme System**: Claude-inspired theming with semantic colors

### Key Features
- **Performance**: Circular buffers handle 10,000+ events efficiently
- **State Management**: Zustand stores with middleware for persistence
- **Type Safety**: Full TypeScript coverage with strict mode
- **Modular Design**: Clear separation of concerns

## Development

### Project Structure

```
cli-demo/
├── src/
│   ├── components/      # UI components
│   │   ├── REPL.tsx    # Main REPL interface
│   │   ├── ErrorBoundary.tsx
│   │   └── ...
│   ├── stores/         # Zustand state stores
│   │   ├── sessionStore.ts  # Session management
│   │   └── ...
│   ├── types/          # TypeScript definitions
│   ├── utils/          # Utility functions
│   │   ├── errorLogger.ts
│   │   └── ...
│   ├── constants/      # Theme and figures
│   ├── hooks/          # Custom React hooks
│   └── index.tsx       # Entry point
├── logs/               # Error logs
├── dist/               # Compiled output
└── bin/                # CLI executable
```

### Available Scripts

- `npm start` - Run the application
- `npm run dev` - Run in development mode with watch
- `npm run build` - Build the TypeScript project
- `npm run typecheck` - Run TypeScript type checking
- `npm run lint` - Run linting checks
- `npm test` - Run test suite

### Testing

The project uses Jest for testing:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## Troubleshooting

### Common Issues

#### Application won't start
- Ensure Node.js 16+ is installed: `node --version`
- Try removing node_modules and reinstalling: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npm run typecheck`

#### Keyboard shortcuts not working
- Some terminals may intercept certain key combinations
- Try alternative shortcuts or customize them in the configuration
- Ensure the application has focus in your terminal

#### Configuration not saving
- Check permissions for `~/.cli-agent/` directory
- Ensure the directory exists: `mkdir -p ~/.cli-agent`
- Check for JSON syntax errors in config.json

### Debug Mode

To run with debug output:

```bash
DEBUG=* npm start
```

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Ink](https://github.com/vadimdemedes/ink) - React for CLI
- State management by [Zustand](https://github.com/pmndrs/zustand)
- TypeScript for type safety