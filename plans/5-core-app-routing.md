# Plan for Issue 5: Core App Component and View Routing

This document outlines the step-by-step plan to complete `issues/5-core-app-routing.md`.

## Implementation Plan

### Phase 1: App Component Structure
- [ ] Create components/App.tsx
- [ ] Import necessary Ink components and hooks
- [ ] Set up basic component structure
- [ ] Connect to UIStore for state management

### Phase 2: Keyboard Handling
- [ ] Implement useInput hook for global shortcuts
- [ ] Add Ctrl+C for exit
- [ ] Add Ctrl+K for command palette toggle
- [ ] Add Ctrl+H for help toggle
- [ ] Add Escape key handling logic
- [ ] Add view navigation shortcuts (Ctrl+D/I/E)

### Phase 3: View Routing
- [ ] Create view router logic in render
- [ ] Add placeholder components for each view
- [ ] Implement conditional rendering based on activeView
- [ ] Add StatusBar placeholder
- [ ] Add overlay container structure

### Phase 4: Entry Point Integration
- [ ] Update src/index.tsx
- [ ] Add TTY environment check
- [ ] Implement render with App component
- [ ] Add error handling for non-TTY environments
- [ ] Initialize stores on app start

## Technical Approach
- Use Ink's Box component for layout
- Implement useInput at top level for global shortcuts
- Use conditional rendering for view switching
- Leverage useApp hook for exit functionality

## Component Structure
```tsx
<Box flexDirection="column" height="100%">
  <Box flexGrow={1}>
    {/* View Router */}
  </Box>
  <StatusBar />
  {/* Overlays */}
</Box>
```

## Potential Challenges
- Keyboard shortcut conflicts
- Proper escape key handling hierarchy
- View transition management
- Store initialization timing