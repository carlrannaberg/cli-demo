# Issue 9: Status Bar Component Implementation

## Requirement
Create the StatusBar component that displays current view, project statistics, and keyboard shortcut hints.

## Acceptance Criteria
- [ ] Status bar shows current active view
- [ ] Project statistics displayed (issues count, completion)
- [ ] Keyboard shortcut hints shown
- [ ] Component uses consistent styling
- [ ] Bar positioned at bottom of screen
- [ ] Updates reflect current application state

## Technical Details
The StatusBar provides persistent information:
- Current view indicator
- Project completion statistics
- Common keyboard shortcuts reminder
- Visual separator from main content

### Display Elements
- Active view name
- Issue counts (completed/total)
- Key shortcuts (Ctrl+K, Ctrl+H, etc.)

## Dependencies
- Issue 3: Project setup must be completed
- Issue 4: State management must be implemented
- Issue 5: App component for integration

## Resources
- Master Plan: `/Users/carl/Development/agents/cli-demo/specs/feat-interactive-terminal-ui.md`