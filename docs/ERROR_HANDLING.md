# Error Handling and Recovery

This document describes the comprehensive error handling and recovery mechanisms implemented in the CLI demo application.

## Components

### 1. Error Boundary (`src/components/ErrorBoundary.tsx`)
- Catches React component errors
- Displays fallback UI with error details
- Provides recovery suggestions
- Logs errors for debugging

### 2. Error Logger (`src/utils/errorLogger.ts`)
- Singleton logger instance
- Writes errors to timestamped log files
- Supports error, warning, and info levels
- Queued writes for performance

### 3. Error Handlers (`src/utils/errorHandlers.ts`)
- Chain of responsibility pattern
- Specialized handlers for:
  - File system errors (ENOENT, EACCES, EPERM, ENOSPC)
  - Network errors (ETIMEDOUT, ECONNREFUSED, ENOTFOUND)
  - State corruption errors
- Retry mechanism with exponential backoff

### 4. Error Toast Utilities (`src/utils/errorToast.ts`)
- Convenient wrappers for showing error toasts
- Recovery suggestions based on error type
- Automatic error logging

### 5. Terminal Resize Handling (`src/utils/useTerminalResize.ts`)
- Monitors terminal size changes
- Warns when terminal is too small (< 60x10)
- Graceful handling of resize errors

## Error Handling Patterns

### Global Error Handling
```typescript
// In src/index.tsx
process.on('uncaughtException', async (error) => {
  await errorLogger.logError(error, { type: 'uncaughtException' });
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', async (reason, promise) => {
  const error = new Error(`Unhandled Rejection: ${reason}`);
  await errorLogger.logError(error, { type: 'unhandledRejection' });
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});
```

### Component Error Boundaries
```typescript
render(
  <ErrorBoundary onError={handleError}>
    <App />
  </ErrorBoundary>
);
```

### Async Error Handling with Retry
```typescript
const saveWithRetry = createRetryHandler(async () => {
  // Operation that might fail
}, 3, 500); // 3 retries, 500ms delay

try {
  await saveWithRetry();
} catch (error) {
  const errorMessage = await handleError(error, { context });
  showErrorToast(error, { showRecovery: true });
}
```

### Store Error Handling
- Configuration store: Atomic saves with backup/restore
- Agent store: Error states for failed executions
- UI store: Toast notifications for user feedback

## Error Recovery Features

1. **Automatic Retry**: Failed operations retry with exponential backoff
2. **Backup/Restore**: Configuration files backed up before modification
3. **Graceful Degradation**: Falls back to defaults on persistent failures
4. **User Feedback**: Clear error messages with recovery suggestions
5. **Error Logging**: All errors logged to `logs/errors-{date}.log`

## Command Palette Integration

New error-related commands:
- **View Error Logs**: Shows location of error log file
- **Clear Error History**: Clears error logs (with confirmation)

## Help Modal Integration

Error recovery section added with common issues and solutions:
- Terminal size requirements
- File permission issues
- State corruption recovery
- Execution failure handling

## Testing Error Scenarios

The agent store includes random error simulation for testing:
```typescript
// Simulate random errors for testing (10% chance)
if (Math.random() < 0.1 && i > 20) {
  throw new Error(`Execution failed at ${i}% progress`);
}
```

## Security Considerations

- Input validation to prevent injection attacks
- Restricted file system access
- Sensitive data never logged
- Error messages sanitized before display

## Future Enhancements

1. Error reporting to external services
2. User-configurable error handling policies
3. Error recovery automation
4. Performance impact monitoring