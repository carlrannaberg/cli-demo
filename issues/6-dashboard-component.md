# Issue 6: Dashboard Component Implementation

## Requirement
Create the Dashboard component with project status overview, quick actions menu, and statistics display.

## Acceptance Criteria
- [ ] Dashboard component displays project status (total/completed/pending/in-progress)
- [ ] Quick actions menu implemented with SelectInput
- [ ] Statistics section shows progress percentage and settings
- [ ] Menu actions trigger appropriate store actions
- [ ] Component properly styled with colors and layout
- [ ] Toast notifications shown for user actions

## Technical Details
The Dashboard serves as the main landing view showing:
- Project status overview with issue counts
- Quick stats including progress percentage
- Interactive menu for common actions
- Integration with both AgentStore and UIStore

### Menu Actions
- Run Next Issue
- Run All Issues  
- View Issues
- Configuration

## Dependencies
- Issue 3: Project setup must be completed
- Issue 4: State management must be implemented
- Issue 5: App component for integration

## Resources
- Master Plan: `/Users/carl/Development/agents/cli-demo/specs/feat-interactive-terminal-ui.md`
- Example code in spec lines 473-538