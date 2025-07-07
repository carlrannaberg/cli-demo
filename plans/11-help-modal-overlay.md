# Plan for Issue 11: Help Modal Overlay Implementation

This document outlines the step-by-step plan to complete `issues/11-help-modal-overlay.md`.

## Implementation Plan

### Phase 1: Component Setup
- [ ] Create components/HelpModal.tsx
- [ ] Import required Ink components
- [ ] Connect to UIStore for showHelp state
- [ ] Set up conditional rendering

### Phase 2: Modal Structure
- [ ] Create overlay Box with absolute positioning
- [ ] Add border and title section
- [ ] Set appropriate width and centering
- [ ] Add padding for content

### Phase 3: Content Organization
- [ ] Create sections for different shortcut categories
- [ ] Add global shortcuts section
- [ ] Add view navigation section
- [ ] Add list navigation section
- [ ] Include modal controls

### Phase 4: Styling and Layout
- [ ] Format shortcuts in columns
- [ ] Use consistent spacing
- [ ] Apply color coding for keys
- [ ] Add section headers

### Phase 5: Scrolling Support
- [ ] Implement scrollable content area
- [ ] Handle long content lists
- [ ] Add scroll indicators if needed
- [ ] Test with various terminal sizes

## Technical Approach
- Use Box with column layout
- Apply consistent text formatting
- Group related shortcuts
- Consider using Static for long lists

## Content Structure
```
┌─────────────────────────────────┐
│         Keyboard Help           │
├─────────────────────────────────┤
│ Global Shortcuts:               │
│   Ctrl+C    Exit Application   │
│   Ctrl+K    Command Palette     │
│   Ctrl+H    Toggle Help         │
│   Escape    Go Back/Close       │
│                                 │
│ Navigation:                     │
│   Ctrl+D    Dashboard           │
│   Ctrl+I    Issues              │
│   Ctrl+E    Execution           │
│                                 │
│ List Controls:                  │
│   ↑↓        Navigate            │
│   Enter     Select/Execute      │
└─────────────────────────────────┘
```

## Potential Challenges
- Content overflow handling
- Consistent key formatting
- Terminal height limitations
- Readable layout on small screens