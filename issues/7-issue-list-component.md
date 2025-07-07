# Issue 7: Issue List Component Implementation

## Requirement
Create the IssueList component with filtering, keyboard navigation, and issue execution capabilities.

## Acceptance Criteria
- [ ] Issue list displays all issues with status indicators
- [ ] Text input filter works for searching issues by name
- [ ] Arrow key navigation updates selected issue
- [ ] Enter key executes selected issue
- [ ] Visual selection indicator shows current issue
- [ ] Component shows keyboard shortcut hints
- [ ] Toast notifications appear for user actions
- [ ] Already completed issues show error when selected

## Technical Details
The IssueList component provides:
- Filterable list of all issues
- Keyboard-driven navigation
- Visual feedback for selection
- Integration with AgentStore for execution
- Real-time filtering as user types

### Key Features
- TextInput for filtering
- Static component for efficient rendering
- useInput hook for keyboard handling
- Selection state management

## Dependencies
- Issue 3: Project setup must be completed
- Issue 4: State management must be implemented
- Issue 5: App component for integration

## Resources
- Master Plan: `/Users/carl/Development/agents/cli-demo/specs/feat-interactive-terminal-ui.md`
- Example code in spec lines 541-607