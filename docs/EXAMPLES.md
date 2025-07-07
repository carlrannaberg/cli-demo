# Configuration Examples

This document provides example configurations for different use cases.

## Basic Configurations

### Default Configuration
```json
{
  "defaultView": "overview",
  "colorTheme": "default",
  "autoCommit": false,
  "provider": "anthropic",
  "keyboardShortcuts": {
    "toggleCommandPalette": "ctrl+p",
    "toggleHelp": "?",
    "navigateUp": "up",
    "navigateDown": "down",
    "select": "enter",
    "back": "escape"
  },
  "outputBufferSize": 1000,
  "maxConcurrentExecutions": 1
}
```

### Vim-style Navigation
```json
{
  "defaultView": "overview",
  "colorTheme": "default",
  "autoCommit": false,
  "provider": "anthropic",
  "keyboardShortcuts": {
    "toggleCommandPalette": "ctrl+p",
    "toggleHelp": "?",
    "navigateUp": "k",
    "navigateDown": "j",
    "select": "enter",
    "back": "escape"
  },
  "outputBufferSize": 1000,
  "maxConcurrentExecutions": 1
}
```

### Emacs-style Shortcuts
```json
{
  "defaultView": "overview",
  "colorTheme": "default",
  "autoCommit": false,
  "provider": "anthropic",
  "keyboardShortcuts": {
    "toggleCommandPalette": "ctrl+x",
    "toggleHelp": "ctrl+h",
    "navigateUp": "ctrl+p",
    "navigateDown": "ctrl+n",
    "select": "ctrl+m",
    "back": "ctrl+g"
  },
  "outputBufferSize": 1000,
  "maxConcurrentExecutions": 1
}
```

## Performance Configurations

### Low Memory Usage
```json
{
  "defaultView": "overview",
  "colorTheme": "default",
  "autoCommit": false,
  "provider": "anthropic",
  "keyboardShortcuts": {
    "toggleCommandPalette": "ctrl+p",
    "toggleHelp": "?",
    "navigateUp": "up",
    "navigateDown": "down",
    "select": "enter",
    "back": "escape"
  },
  "outputBufferSize": 100,
  "maxConcurrentExecutions": 1
}
```

### High Performance
```json
{
  "defaultView": "overview",
  "colorTheme": "default",
  "autoCommit": true,
  "provider": "anthropic",
  "keyboardShortcuts": {
    "toggleCommandPalette": "ctrl+p",
    "toggleHelp": "?",
    "navigateUp": "up",
    "navigateDown": "down",
    "select": "enter",
    "back": "escape"
  },
  "outputBufferSize": 5000,
  "maxConcurrentExecutions": 3
}
```

## Workflow Configurations

### Developer Workflow
```json
{
  "defaultView": "issues",
  "colorTheme": "default",
  "autoCommit": true,
  "provider": "anthropic",
  "keyboardShortcuts": {
    "toggleCommandPalette": "ctrl+k",
    "toggleHelp": "f1",
    "navigateUp": "up",
    "navigateDown": "down",
    "select": "enter",
    "back": "escape"
  },
  "outputBufferSize": 2000,
  "maxConcurrentExecutions": 2
}
```

### Project Manager Workflow
```json
{
  "defaultView": "overview",
  "colorTheme": "default",
  "autoCommit": false,
  "provider": "anthropic",
  "keyboardShortcuts": {
    "toggleCommandPalette": "ctrl+p",
    "toggleHelp": "?",
    "navigateUp": "up",
    "navigateDown": "down",
    "select": "enter",
    "back": "escape"
  },
  "outputBufferSize": 500,
  "maxConcurrentExecutions": 1
}
```

## Provider-Specific Configurations

### OpenAI Provider
```json
{
  "defaultView": "overview",
  "colorTheme": "default",
  "autoCommit": false,
  "provider": "openai",
  "keyboardShortcuts": {
    "toggleCommandPalette": "ctrl+p",
    "toggleHelp": "?",
    "navigateUp": "up",
    "navigateDown": "down",
    "select": "enter",
    "back": "escape"
  },
  "outputBufferSize": 1000,
  "maxConcurrentExecutions": 1
}
```

### Custom Provider
```json
{
  "defaultView": "overview",
  "colorTheme": "default",
  "autoCommit": false,
  "provider": "custom",
  "keyboardShortcuts": {
    "toggleCommandPalette": "ctrl+p",
    "toggleHelp": "?",
    "navigateUp": "up",
    "navigateDown": "down",
    "select": "enter",
    "back": "escape"
  },
  "outputBufferSize": 1000,
  "maxConcurrentExecutions": 1
}
```

## Advanced Examples

### Multi-Monitor Setup
```json
{
  "defaultView": "execution",
  "colorTheme": "default",
  "autoCommit": false,
  "provider": "anthropic",
  "keyboardShortcuts": {
    "toggleCommandPalette": "f1",
    "toggleHelp": "f2",
    "navigateUp": "up",
    "navigateDown": "down",
    "select": "space",
    "back": "escape"
  },
  "outputBufferSize": 3000,
  "maxConcurrentExecutions": 2
}
```

### Accessibility-Focused
```json
{
  "defaultView": "overview",
  "colorTheme": "default",
  "autoCommit": false,
  "provider": "anthropic",
  "keyboardShortcuts": {
    "toggleCommandPalette": "alt+p",
    "toggleHelp": "alt+h",
    "navigateUp": "alt+up",
    "navigateDown": "alt+down",
    "select": "alt+enter",
    "back": "alt+left"
  },
  "outputBufferSize": 1000,
  "maxConcurrentExecutions": 1
}
```

## Usage Tips

### Switching Configurations

1. **Manual Edit**:
   ```bash
   # Edit directly
   nano ~/.cli-agent/config.json
   
   # Or use your preferred editor
   code ~/.cli-agent/config.json
   ```

2. **Backup Current Config**:
   ```bash
   cp ~/.cli-agent/config.json ~/.cli-agent/config.backup.json
   ```

3. **Apply New Config**:
   ```bash
   # Copy example config
   cp docs/examples/vim-config.json ~/.cli-agent/config.json
   
   # Restart application
   npm start
   ```

### Config Validation

Before applying a new configuration:

```bash
# Validate JSON syntax
cat new-config.json | jq .

# Test in safe mode
CLI_DEMO_CONFIG=./new-config.json npm start
```

### Environment-Based Configs

Use different configs for different environments:

```bash
# Development
export CLI_DEMO_CONFIG=~/.cli-agent/config.dev.json

# Production
export CLI_DEMO_CONFIG=~/.cli-agent/config.prod.json

# Testing
export CLI_DEMO_CONFIG=~/.cli-agent/config.test.json
```

## Creating Custom Configurations

### Step 1: Start with Default
```bash
cp ~/.cli-agent/config.json ~/.cli-agent/my-config.json
```

### Step 2: Modify Settings
Edit the file with your preferences:
- Change keyboard shortcuts to match your workflow
- Adjust buffer sizes based on your system
- Set default view to your most-used screen

### Step 3: Test Configuration
```bash
# Backup current
mv ~/.cli-agent/config.json ~/.cli-agent/config.old.json

# Apply new
cp ~/.cli-agent/my-config.json ~/.cli-agent/config.json

# Test
npm start
```

### Step 4: Share Configuration
Share your configuration with the team:
```bash
# Add to version control
cp ~/.cli-agent/config.json ./configs/team-config.json
git add ./configs/team-config.json
git commit -m "Add team configuration"
```

## Configuration Best Practices

1. **Start Simple**: Begin with defaults and customize gradually
2. **Document Changes**: Add comments about why settings were changed
3. **Version Control**: Keep configurations in git for team sharing
4. **Regular Backups**: Backup before major changes
5. **Test Thoroughly**: Verify all shortcuts work in your terminal