# Issue 12: Toast Notifications Component

## Requirement
Implement a toast notification system for displaying temporary messages with auto-dismiss functionality.

## Acceptance Criteria
- [ ] Toast component created with support for success/error/info states
- [ ] Auto-dismiss after 3 seconds
- [ ] Proper positioning (top-right corner)
- [ ] Smooth appearance/disappearance animations
- [ ] Integration with UIStore for toast management
- [ ] Toast queue handling for multiple notifications

## Technical Details
This issue implements the toast notification system as specified in the master plan. The toast component will provide user feedback for actions and status updates.

### Key Features
- Multiple toast types (success, error, info)
- Auto-dismiss with configurable timeout
- Absolute positioning overlay
- Color-coded based on type
- Integration with existing UIStore

## Dependencies
- Issue #4: State Management Implementation (UIStore must be implemented)
- Issue #5: Core App Component (for overlay rendering)

## Resources
- Master Plan: `/Users/carl/Development/agents/cli-demo/specs/feat-interactive-terminal-ui.md`