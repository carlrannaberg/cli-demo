# Troubleshooting Guide

This guide helps you resolve common issues with the CLI Agent Demo application.

## Common Issues

### Application Won't Start

#### Problem: "command not found" error
```bash
$ npm start
bash: npm: command not found
```

**Solution**: Install Node.js and npm
- Download from [nodejs.org](https://nodejs.org/)
- Or use a version manager like `nvm`:
  ```bash
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
  nvm install 16
  nvm use 16
  ```

#### Problem: TypeScript compilation errors
```
error TS2322: Type 'string' is not assignable to type 'View'.
```

**Solution**: 
1. Clean build artifacts:
   ```bash
   rm -rf dist/
   npm run build
   ```
2. Check TypeScript version:
   ```bash
   npm list typescript
   ```
3. Update dependencies:
   ```bash
   npm update
   ```

#### Problem: Module not found errors
```
Error: Cannot find module 'ink'
```

**Solution**: Reinstall dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### Keyboard Shortcuts Not Working

#### Problem: Shortcuts are intercepted by terminal
Some terminals capture certain key combinations before they reach the application.

**Solution**: 
1. Try alternative terminals:
   - iTerm2 (macOS)
   - Windows Terminal
   - Alacritty
   
2. Disable terminal shortcuts that conflict:
   - Check terminal preferences
   - Look for "Keyboard" or "Shortcuts" settings
   
3. Use alternative key combinations in config:
   ```json
   {
     "keyboardShortcuts": {
       "toggleCommandPalette": "ctrl+p",
       "toggleHelp": "ctrl+shift+h"
     }
   }
   ```

#### Problem: Ctrl+C doesn't exit
**Solution**: 
- Use `Ctrl+C` twice rapidly
- Or use `:q` in command palette
- Force quit: `killall node`

### Display Issues

#### Problem: UI elements overlap or misalign
```
┌─────────┐verviewompleted
│Dashboard│ 3
```

**Solution**:
1. Resize terminal window
2. Check terminal size:
   ```bash
   echo "Columns: $COLUMNS, Rows: $LINES"
   ```
3. Minimum recommended: 80x24
4. Set fixed size in terminal preferences

#### Problem: Colors not displaying correctly
**Solution**:
1. Check terminal color support:
   ```bash
   echo $TERM
   tput colors
   ```
2. Enable 256 colors:
   ```bash
   export TERM=xterm-256color
   ```
3. For true color support:
   ```bash
   export COLORTERM=truecolor
   ```

### Configuration Issues

#### Problem: Configuration not saving
```
Error: Failed to save configuration: EACCES: permission denied
```

**Solution**:
1. Check directory permissions:
   ```bash
   ls -la ~/.cli-agent/
   ```
2. Fix permissions:
   ```bash
   mkdir -p ~/.cli-agent
   chmod 755 ~/.cli-agent
   ```
3. Check disk space:
   ```bash
   df -h ~
   ```

#### Problem: Invalid configuration file
```
Error: Failed to load configuration: Unexpected token } in JSON
```

**Solution**:
1. Validate JSON syntax:
   ```bash
   cat ~/.cli-agent/config.json | jq .
   ```
2. Reset to defaults:
   ```bash
   rm ~/.cli-agent/config.json
   npm start  # Will recreate with defaults
   ```

### Performance Issues

#### Problem: Slow rendering or lag
**Solution**:
1. Reduce output buffer size in config:
   ```json
   {
     "outputBufferSize": 500
   }
   ```
2. Clear execution output regularly (press `c` in execution view)
3. Check system resources:
   ```bash
   top -n 1
   ```

#### Problem: High CPU usage
**Solution**:
1. Check for runaway processes:
   ```bash
   ps aux | grep node
   ```
2. Enable performance monitoring:
   ```bash
   DEBUG=* npm start 2> debug.log
   ```
3. Reduce update frequency in development

### Agent Execution Issues

#### Problem: Agent won't start
```
Error: Agent initialization failed
```

**Solution**:
1. Check provider configuration
2. Verify API keys (if using external providers)
3. Check network connectivity
4. Review agent logs in execution view

#### Problem: Execution hangs
**Solution**:
1. Stop execution: Press `s` in execution view
2. Check max concurrent executions in config
3. Clear execution state:
   ```bash
   # Restart the application
   npm start
   ```

## Debug Mode

### Enable Debug Output
```bash
# Basic debug
DEBUG=cli-demo:* npm start

# Verbose debug
DEBUG=* npm start

# Write to file
DEBUG=* npm start 2> debug.log
```

### Debug Categories
- `cli-demo:ui` - UI rendering issues
- `cli-demo:store` - State management
- `cli-demo:keyboard` - Keyboard input
- `cli-demo:config` - Configuration loading

## Platform-Specific Issues

### macOS

#### Problem: Permission errors with global npm
**Solution**: Use npm with proper permissions
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc
```

### Windows

#### Problem: Path too long errors
**Solution**: 
1. Enable long paths in Windows:
   - Run as Administrator: `git config --system core.longpaths true`
2. Move project to shorter path:
   ```bash
   C:\cli-demo
   ```

#### Problem: Line ending issues
**Solution**: Configure git:
```bash
git config --global core.autocrlf true
```

### Linux

#### Problem: Permission denied on execution
**Solution**: 
```bash
chmod +x node_modules/.bin/*
```

## Getting Help

### Check Logs
1. Application logs: Check terminal output
2. System logs: 
   - macOS: `Console.app`
   - Linux: `journalctl -f`
   - Windows: Event Viewer

### Report Issues
1. Gather information:
   - Node version: `node --version`
   - npm version: `npm --version`
   - OS: `uname -a` (Unix) or `ver` (Windows)
   - Terminal: `echo $TERM`

2. Create minimal reproduction
3. File issue on GitHub with:
   - Steps to reproduce
   - Expected vs actual behavior
   - Error messages
   - Environment details

### Community Support
- GitHub Discussions
- Discord server
- Stack Overflow tag: `cli-agent-demo`

## Recovery Procedures

### Full Reset
```bash
# Backup configuration
cp ~/.cli-agent/config.json ~/.cli-agent/config.backup.json

# Clean everything
rm -rf node_modules dist ~/.cli-agent
npm install
npm run build
npm start
```

### Safe Mode
Start with minimal configuration:
```bash
CLI_DEMO_SAFE_MODE=1 npm start
```

This disables:
- Custom configurations
- Plugins/extensions
- Non-essential features