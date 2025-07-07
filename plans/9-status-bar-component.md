# Plan for Issue 9: Status Bar Component Implementation

This document outlines the step-by-step plan to complete `issues/9-status-bar-component.md`.

## Implementation Plan

### Phase 1: Component Setup
- [ ] Create components/StatusBar.tsx
- [ ] Import stores and Ink components
- [ ] Connect to both UIStore and AgentStore
- [ ] Set up basic Box layout

### Phase 2: View Indicator
- [ ] Get activeView from UIStore
- [ ] Create view name mapping
- [ ] Display with appropriate styling
- [ ] Add view-specific icons/colors

### Phase 3: Project Statistics
- [ ] Get projectStatus from AgentStore
- [ ] Display completed/total issues
- [ ] Calculate completion percentage
- [ ] Format statistics text

### Phase 4: Keyboard Hints
- [ ] Create shortcuts display
- [ ] Include most common shortcuts
- [ ] Use dim text for subtle display
- [ ] Ensure proper spacing

### Phase 5: Styling and Layout
- [ ] Add border or separator line
- [ ] Apply consistent padding
- [ ] Use flexbox for alignment
- [ ] Test with different terminal widths

## Technical Approach
- Use Box with row direction
- Leverage Spacer for alignment
- Apply dim colors for hints
- Keep height minimal

## Visual Layout
```
─────────────────────────────────────────────────
Dashboard | 2/5 issues | Ctrl+K: Cmd | Ctrl+H: Help
```

## Potential Challenges
- Terminal width constraints
- Dynamic content sizing
- Consistent positioning
- Color scheme compatibility