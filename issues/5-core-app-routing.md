# Issue 5: Core App Component and View Routing

## Requirement
Implement the main App component with view routing, global keyboard handling, and overlay management.

## Acceptance Criteria
- [ ] App component created as the root component
- [ ] View routing implemented based on UIStore state
- [ ] Global keyboard shortcuts configured (Ctrl+C, Ctrl+K, etc.)
- [ ] Escape key navigation logic implemented
- [ ] View switching shortcuts working (Ctrl+D, Ctrl+I, Ctrl+E)
- [ ] Overlay rendering placeholder added
- [ ] Entry point updated to render App component

## Technical Details
This issue creates the core application structure with:
- Main App component with useInput hook for keyboard handling
- View router that switches between Dashboard, IssueList, and ExecutionView
- Global keyboard shortcut management
- Integration with UIStore for navigation state

### Key Features
- Global keyboard shortcuts
- View-based routing
- Overlay container structure
- Proper Ink app lifecycle management

## Dependencies
- Issue 3: Project setup must be completed
- Issue 4: State management must be implemented

## Resources
- Master Plan: `/Users/carl/Development/agents/cli-demo/specs/feat-interactive-terminal-ui.md`
- Ink useInput documentation