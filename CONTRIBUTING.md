# Contributing to CLI Agent Demo

We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

## Setting Up Development Environment

### Prerequisites

- Node.js 16 or higher
- npm or yarn
- Git

### Setup Steps

```bash
# Fork and clone the repository
git clone https://github.com/yourusername/cli-demo.git
cd cli-demo

# Install dependencies
npm install

# Run in development mode
npm run dev
```

### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/my-new-feature
   ```

2. **Make your changes**
   - Follow the coding standards (see below)
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**
   ```bash
   # Run type checking
   npm run typecheck
   
   # Run linting
   npm run lint
   
   # Run tests
   npm test
   
   # Run the app to manually test
   npm start
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

## Coding Standards

### TypeScript

- Enable strict mode
- Use explicit typing for function parameters and return types
- Prefer interfaces over type aliases for object types
- Use enums for sets of named constants

```typescript
// Good
interface UserConfig {
  name: string;
  theme: ColorTheme;
}

function processConfig(config: UserConfig): void {
  // ...
}

// Avoid
type UserConfig = {
  name: string;
  theme: string;
}

function processConfig(config: any) {
  // ...
}
```

### React/Ink Components

- Use functional components with hooks
- Keep components focused and single-purpose
- Extract complex logic into custom hooks
- Use proper TypeScript types for props

```typescript
// Good
interface StatusBarProps {
  message?: string;
  variant?: 'info' | 'success' | 'error';
}

const StatusBar: React.FC<StatusBarProps> = ({ message, variant = 'info' }) => {
  // ...
};

// Avoid
const StatusBar = (props: any) => {
  // ...
};
```

### State Management (Zustand)

- Keep stores focused on a single domain
- Use TypeScript interfaces for store state
- Document complex state transformations
- Avoid deeply nested state

```typescript
// Good
interface UIState {
  activeView: ViewType;
  isLoading: boolean;
  error: string | null;
}

// Avoid
interface AppState {
  ui: {
    views: {
      active: {
        current: string;
      };
    };
  };
}
```

### File Organization

```
src/
├── components/       # UI components
│   ├── App.tsx
│   ├── Dashboard.tsx
│   └── ...
├── stores/          # Zustand stores
│   ├── uiStore.ts
│   ├── agentStore.ts
│   └── ...
├── types/           # TypeScript type definitions
│   └── index.ts
├── utils/           # Utility functions
│   └── keyboardUtils.ts
└── index.tsx        # Entry point
```

## Testing

### Test Structure

- Place tests in `__tests__` directories
- Name test files with `.test.ts` or `.test.tsx`
- Group related tests using `describe` blocks
- Write descriptive test names

```typescript
describe('StatusBar', () => {
  it('should display the provided message', () => {
    // ...
  });
  
  it('should apply correct styling for error variant', () => {
    // ...
  });
});
```

### Testing Guidelines

- Test user interactions, not implementation details
- Mock external dependencies
- Aim for high code coverage but prioritize meaningful tests
- Test error cases and edge conditions

## Pull Request Process

1. **Update Documentation**
   - Update README.md with details of changes to the interface
   - Update any relevant documentation in the `docs/` folder

2. **Follow the PR Template**
   - Describe your changes
   - Reference any related issues
   - Include screenshots for UI changes

3. **Code Review**
   - At least one maintainer must review and approve
   - All CI checks must pass
   - Resolve all review comments

4. **Commit Messages**
   
   Follow conventional commits:
   
   ```
   feat: add new command palette feature
   fix: resolve keyboard shortcut conflict
   docs: update installation instructions
   style: format code with prettier
   refactor: extract common keyboard logic
   test: add tests for command palette
   chore: update dependencies
   ```

## Reporting Bugs

### Security Vulnerabilities

If you find a security vulnerability, please email security@example.com instead of using the issue tracker.

### Bug Reports

When filing an issue, please include:

1. **Environment Details**
   - Node.js version
   - Operating system
   - Terminal emulator

2. **Steps to Reproduce**
   - Clear, numbered steps
   - Minimal code example if applicable

3. **Expected vs Actual Behavior**
   - What you expected to happen
   - What actually happened
   - Error messages or screenshots

### Feature Requests

We welcome feature requests! Please:

1. Check existing issues first
2. Clearly describe the feature
3. Explain the use case
4. Consider implementation approach

## Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of:
- Age, body size, disability, ethnicity, sex characteristics
- Gender identity and expression
- Level of experience, education, socio-economic status
- Nationality, personal appearance, race, religion
- Sexual identity and orientation

### Expected Behavior

- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Gracefully accept constructive criticism
- Focus on what's best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Sexualized language or imagery
- Trolling, insulting/derogatory comments
- Public or private harassment
- Publishing others' private information
- Other conduct which could reasonably be considered inappropriate

## Getting Help

- **Discord**: Join our community server
- **GitHub Discussions**: Ask questions and share ideas
- **Issue Tracker**: Report bugs and request features
- **Documentation**: Check the docs folder

## Recognition

Contributors who make significant contributions may be:
- Added to the CONTRIBUTORS file
- Given collaborator access
- Mentioned in release notes
- Featured on the project website

## License

By contributing, you agree that your contributions will be licensed under the same MIT License that covers the project.