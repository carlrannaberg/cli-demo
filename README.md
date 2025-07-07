# CLI Agent Demo

An interactive terminal UI application for managing AI agent tasks, built with Ink (React for CLI) and TypeScript.

## Features

- **Interactive Dashboard**: View and manage AI agent tasks in a terminal-based UI
- **Multiple Views**: Navigate between Dashboard, Issues, Execution, and Configuration views
- **Keyboard Shortcuts**: Efficient navigation with customizable keyboard shortcuts
- **State Management**: Powered by Zustand for predictable state updates
- **Configuration**: Customizable settings with persistent storage
- **Command Palette**: Quick access to commands with `Ctrl+K`
- **Help System**: Built-in help modal with `Ctrl+H`
- **Toast Notifications**: Real-time feedback for user actions
- **TypeScript**: Full type safety throughout the application

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

### Basic Navigation

The application starts with the Dashboard view. Use the following keyboard shortcuts to navigate:

- **`Ctrl+D`**: Go to Dashboard
- **`Ctrl+I`**: Go to Issues list
- **`Ctrl+E`**: Go to Execution view
- **`Escape`**: Return to Dashboard from any view

### Global Shortcuts

These shortcuts work from any screen:

- **`Ctrl+K`**: Open Command Palette
- **`Ctrl+H`**: Open Help Modal
- **`Ctrl+C`**: Exit the application

### View-Specific Controls

#### Issues List
- **`↑/↓`** or **`j/k`**: Navigate through issues
- **`Enter`**: View issue details
- **`Space`**: Toggle issue selection
- **`r`**: Refresh issues list

#### Dashboard
- **`Tab`**: Cycle through dashboard sections
- **`Enter`**: Activate selected section

#### Execution View
- **`s`**: Start/Stop execution
- **`c`**: Clear output
- **`PageUp/PageDown`**: Scroll through output

## Configuration

The application stores configuration in `~/.cli-agent/config.json`. You can customize:

```json
{
  "defaultView": "overview",
  "colorTheme": "default",
  "autoCommit": false,
  "provider": "anthropic",
  "keyboardShortcuts": {
    "toggleCommandPalette": "ctrl+p",
    "toggleHelp": "?",
    "navigateUp": "up",
    "navigateDown": "down",
    "select": "enter",
    "back": "escape"
  },
  "outputBufferSize": 1000,
  "maxConcurrentExecutions": 1
}
```

### Configuration Options

- **`defaultView`**: The view to show on startup (`overview`, `issues`, `execution`, `config`)
- **`colorTheme`**: Color theme for the UI (currently only `default` is supported)
- **`autoCommit`**: Whether to automatically commit changes
- **`provider`**: AI provider to use (`anthropic`, `openai`, etc.)
- **`outputBufferSize`**: Maximum lines to keep in execution output
- **`maxConcurrentExecutions`**: Number of parallel executions allowed

## Architecture

The application follows a React-based architecture with:

- **Components**: React components built with Ink for terminal rendering
- **State Management**: Zustand stores for application state
- **TypeScript**: Full type safety and IntelliSense support
- **Modular Design**: Clear separation of concerns

For detailed architecture documentation, see [ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Development

### Project Structure

```
cli-demo/
├── src/
│   ├── components/      # UI components
│   ├── stores/         # Zustand state stores
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   └── index.tsx       # Application entry point
├── dist/               # Compiled output
├── issues/             # Issue tracking
└── specs/              # Project specifications
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