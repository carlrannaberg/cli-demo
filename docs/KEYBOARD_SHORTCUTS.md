# Keyboard Shortcuts Reference

## Global Shortcuts
These shortcuts work from any screen in the application.

| Shortcut | Action | Notes |
|----------|---------|-------|
| `Ctrl+C` | Exit application | Works everywhere |
| `Ctrl+H` | Toggle help modal | Shows/hides help |
| `Ctrl+K` | Toggle command palette | Quick command access |
| `Escape` | Go back / Cancel | Returns to previous view |

## View Navigation

| Shortcut | Action | From |
|----------|---------|------|
| `Ctrl+D` | Go to Dashboard | Any view |
| `Ctrl+I` | Go to Issues list | Any view |
| `Ctrl+E` | Go to Execution view | Any view |
| `Escape` | Return to Dashboard | Any view except Dashboard |

## Dashboard Shortcuts

| Shortcut | Action |
|----------|---------|
| `Tab` | Next section |
| `Shift+Tab` | Previous section |
| `Enter` | Activate selected section |

## Issues List Shortcuts

| Shortcut | Action |
|----------|---------|
| `↑` / `k` | Move up |
| `↓` / `j` | Move down |
| `Enter` | View issue details |
| `Space` | Toggle issue selection |
| `r` | Refresh issues list |
| `Escape` | Back to Dashboard |

## Execution View Shortcuts

| Shortcut | Action |
|----------|---------|
| `s` | Start/Stop execution |
| `c` | Clear output |
| `PageUp` | Scroll output up |
| `PageDown` | Scroll output down |
| `Home` | Go to top of output |
| `End` | Go to bottom of output |
| `Escape` | Back to Dashboard |

## Command Palette Shortcuts

| Shortcut | Action |
|----------|---------|
| `↑` / `↓` | Navigate commands |
| `Enter` | Execute selected command |
| `Escape` | Close command palette |
| Type to filter | Search commands |

## Configuration View Shortcuts

| Shortcut | Action |
|----------|---------|
| `↑` / `↓` | Navigate settings |
| `Enter` | Edit selected setting |
| `s` | Save configuration |
| `r` | Reset to defaults |
| `Escape` | Back to Dashboard |

## Help Modal Shortcuts

| Shortcut | Action |
|----------|---------|
| `↑` / `↓` | Scroll help content |
| `Escape` | Close help modal |
| `Ctrl+H` | Close help modal |

## Quick Tips

### Vim Users
The application supports vim-style navigation in lists:
- `j` - Move down
- `k` - Move up
- `h` - Go back (like Escape)
- `l` - Select (like Enter)

### Customization
You can customize any shortcut in `~/.cli-agent/config.json`:

```json
{
  "keyboardShortcuts": {
    "toggleCommandPalette": "ctrl+p",
    "toggleHelp": "?",
    "navigateUp": "up",
    "navigateDown": "down",
    "select": "enter",
    "back": "escape"
  }
}
```

### Terminal Compatibility
Some terminals may intercept certain shortcuts. Common conflicts:
- `Ctrl+K` - Often used for clear in terminals
- `Ctrl+D` - Often used for EOF/logout
- `Ctrl+C` - Usually works but some terminals need it twice

If you experience conflicts, customize the shortcuts in your configuration.

## Shortcut Patterns

The application follows these patterns for consistency:

1. **Global actions**: `Ctrl + Letter`
2. **Navigation**: Arrow keys or vim keys
3. **Selection**: `Enter` or `Space`
4. **Cancel/Back**: `Escape`
5. **Refresh/Reload**: `r`
6. **Save**: `s` (in appropriate contexts)
7. **Clear**: `c` (in appropriate contexts)

## Accessibility

For users who need accessible shortcuts:

1. All shortcuts can be customized
2. No shortcuts require multiple simultaneous keys (except Ctrl/Alt modifiers)
3. Tab navigation is supported where appropriate
4. Screen reader users can navigate with standard keys

## Troubleshooting Shortcuts

If shortcuts aren't working:

1. **Check terminal**: Some terminals capture shortcuts
2. **Check focus**: Ensure the application has focus
3. **Check modals**: Some shortcuts are disabled when modals are open
4. **Test in safe mode**: `CLI_DEMO_SAFE_MODE=1 npm start`

For more help, see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)