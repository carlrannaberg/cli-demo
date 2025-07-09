import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { useSessionStore } from '../stores/sessionStore.js';
import { REPLCommand, REPLCommandType } from '../types/index.js';
import { useTheme } from '../hooks/useTheme.js';

interface REPLProps {
  onExit?: () => void;
}

/**
 * REPL (Read-Eval-Print Loop) component for autonomous coding sessions
 * Provides command-line interface for interacting with coding sessions
 */
const REPL: React.FC<REPLProps> = ({ onExit }) => {
  const theme = useTheme();
  const [input, setInput] = useState('');
  const [isInputFocused] = useState(true);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(0);

  // Command definitions for slash commands
  const commands = React.useMemo(() => [
    { name: 'demo', description: 'Start a demo session with autonomous coding', aliases: ['d'] },
    { name: 'start', description: 'Start a new coding session', aliases: ['s'], args: '[sessionId]' },
    { name: 'stop', description: 'Stop the current session', aliases: [] },
    { name: 'status', description: 'Show session status', aliases: ['st'] },
    { name: 'monitor', description: 'Show execution statistics', aliases: ['m', 'stats'] },
    { name: 'auto-execute', description: 'Start autonomous execution of all tasks', aliases: ['auto', 'ae'] },
    { name: 'pause', description: 'Pause autonomous execution', aliases: ['p'] },
    { name: 'resume', description: 'Resume autonomous execution', aliases: ['r'] },
    { name: 'tasks', description: 'List available tasks', aliases: ['t', 'list'] },
    { name: 'task', description: 'Execute a specific task', aliases: ['execute', 'exec'], args: '<name>' },
    { name: 'clear', description: 'Clear output', aliases: ['c', 'cls'] },
    { name: 'help', description: 'Show help message', aliases: ['h', '?'] },
  ], []);

  // Get filtered suggestions based on input
  const getSuggestions = React.useCallback((query: string) => {
    if (!query.startsWith('/')) {
      return [];
    }
    
    const searchTerm = query.slice(1).toLowerCase();
    if (searchTerm === '') {
      return commands;
    }
    
    return commands.filter(cmd => 
      cmd.name.toLowerCase().startsWith(searchTerm) ||
      cmd.aliases.some(alias => alias.toLowerCase().startsWith(searchTerm))
    );
  }, [commands]);

  const {
    currentSession,
    outputs,
    stats,
    startSession,
    stopSession,
    addOutput,
    addCommand,
    clearOutput,
    generateMockSession: _generateMockSession,
    simulateTaskExecution,
    startDemoSession,
    autoExecuteAll,
    pauseAutoExecution,
    resumeAutoExecution,
    getAvailableTasks,
    isAutoExecuting
  } = useSessionStore();

  // Update suggestions when input changes
  React.useEffect(() => {
    const suggestions = getSuggestions(input);
    setShowSuggestions(suggestions.length > 0 && input.startsWith('/'));
    setSelectedSuggestion(0);
  }, [input, getSuggestions]);

  // Handle keyboard navigation
  useInput((inputKey, key) => {
    if (!isInputFocused) {
      return;
    }

    // Handle suggestion navigation
    if (showSuggestions) {
      const suggestions = getSuggestions(input);
      
      if (key.upArrow) {
        setSelectedSuggestion(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        return;
      }
      
      if (key.downArrow) {
        setSelectedSuggestion(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        return;
      }
      
      if (key.tab || (key.return && suggestions.length > 0)) {
        const selected = suggestions[selectedSuggestion];
        const commandWithSlash = `/${selected.name}`;
        const needsArgs = selected.args;
        setInput(needsArgs ? `${commandWithSlash} ` : commandWithSlash);
        setShowSuggestions(false);
        if (!needsArgs && key.return) {
          // Execute immediately if no args needed
          handleSubmit(commandWithSlash);
        }
        return;
      }
      
      if (key.escape) {
        setShowSuggestions(false);
        return;
      }
    }

    // Handle command history navigation (only when not showing suggestions)
    if (!showSuggestions) {
      if (key.upArrow && commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      } else if (key.downArrow && historyIndex >= 0) {
        const newIndex = historyIndex > 0 ? historyIndex - 1 : -1;
        setHistoryIndex(newIndex);
        setInput(newIndex >= 0 ? commandHistory[commandHistory.length - 1 - newIndex] || '' : '');
      }
    }

    // Handle Ctrl+C for exit
    if (key.ctrl && inputKey === 'c') {
      if (onExit) {
        onExit();
      }
    }

    // Handle Ctrl+L for clear
    if (key.ctrl && inputKey === 'l') {
      clearOutput();
    }
  });

  const parseCommand = (commandLine: string): REPLCommand => {
    let cleanCommand = commandLine.trim();
    
    // Handle slash commands
    if (cleanCommand.startsWith('/')) {
      cleanCommand = cleanCommand.slice(1);
    }
    
    const parts = cleanCommand.split(/\s+/);
    let commandName = parts[0];
    
    // Resolve aliases
    const cmd = commands.find(c => 
      c.name === commandName || c.aliases.includes(commandName)
    );
    if (cmd) {
      commandName = cmd.name;
    }
    
    const type = commandName as REPLCommandType;
    const args = parts.slice(1);

    return {
      type,
      args,
      timestamp: new Date()
    };
  };

  const executeCommand = async (commandLine: string) => {
    const trimmed = commandLine.trim();
    
    // Don't execute if empty or just a slash
    if (!trimmed || trimmed === '/') {
      return;
    }

    // Add to command history
    setCommandHistory(prev => [...prev, commandLine]);
    setHistoryIndex(-1);

    // Parse command
    const command = parseCommand(commandLine);
    addCommand(command);

    // Add command to output
    addOutput({
      id: `cmd-${Date.now()}`,
      timestamp: new Date(),
      type: 'command',
      content: `> ${commandLine}`,
      metadata: { command: command.type }
    });

    // Execute command
    try {
      await handleCommand(command);
    } catch (error) {
      addOutput({
        id: `error-${Date.now()}`,
        timestamp: new Date(),
        type: 'error',
        content: `Error: ${error instanceof Error ? error.message : String(error)}`,
        metadata: { command: command.type }
      });
    }
  };

  const handleCommand = async (command: REPLCommand) => {
    switch (command.type) {
      case 'start': {
        if (currentSession) {
          addOutput({
            id: `output-${Date.now()}`,
            timestamp: new Date(),
            type: 'output',
            content: 'Session already active. Use "stop" to end current session.',
            metadata: {}
          });
        } else {
          startSession(command.args?.[0]);
        }
        break;
      }

      case 'stop':
        if (currentSession) {
          stopSession();
        } else {
          addOutput({
            id: `output-${Date.now()}`,
            timestamp: new Date(),
            type: 'output',
            content: 'No active session to stop.',
            metadata: {}
          });
        }
        break;

      case 'status': {
        const statusInfo = currentSession 
          ? `Session: ${currentSession.id} (${currentSession.status})\nTasks: ${currentSession.completedTasks}/${currentSession.totalTasks}\nPhase: ${currentSession.currentPhase}`
          : 'No active session';
        
        addOutput({
          id: `output-${Date.now()}`,
          timestamp: new Date(),
          type: 'output',
          content: statusInfo,
          metadata: { currentSession: currentSession?.id }
        });
        break;
      }

      case 'clear':
        clearOutput();
        break;

      case 'help': {
        const helpText = `Available commands (type / to autocomplete):
  /start [sessionId]  - Start a new coding session
  /demo              - Start a demo session with autonomous coding
  /stop              - Stop the current session
  /status            - Show session status
  /clear             - Clear output
  /help              - Show this help message
  /task <name>       - Execute a specific task
  /monitor           - Show execution statistics
  /auto-execute      - Start autonomous execution of all pending tasks
  /pause             - Pause autonomous execution
  /resume            - Resume autonomous execution
  /tasks             - List available tasks
  
Command Aliases:
  /d = /demo, /s = /start, /st = /status, /m = /monitor
  /auto = /auto-execute, /p = /pause, /r = /resume
  /t = /tasks, /exec = /task, /c = /clear, /h = /help
  
Navigation:
  ↑/↓ arrows       - Navigate command history/suggestions
  Tab              - Complete suggestion
  Enter            - Execute command
  Ctrl+C           - Exit REPL
  Ctrl+L           - Clear output`;
        
        addOutput({
          id: `output-${Date.now()}`,
          timestamp: new Date(),
          type: 'output',
          content: helpText,
          metadata: {}
        });
        break;
      }

      case 'task':
      case 'execute': {
        const taskName = command.args?.join(' ') || 'Unnamed Task';
        if (currentSession) {
          await simulateTaskExecution(taskName);
        } else {
          addOutput({
            id: `output-${Date.now()}`,
            timestamp: new Date(),
            type: 'output',
            content: 'No active session. Use "start" to begin a session.',
            metadata: {}
          });
        }
        break;
      }

      case 'monitor': {
        const successBar = '█'.repeat(Math.floor(stats.successRate / 10)) + '░'.repeat(10 - Math.floor(stats.successRate / 10));
        const throughputBar = '▸'.repeat(Math.min(10, Math.floor(stats.currentThroughput))) + '·'.repeat(Math.max(0, 10 - Math.floor(stats.currentThroughput)));
        
        const statsText = `
╭─── Execution Statistics ────────────────────────╮
│                                                 │
│  📊 Task Overview                               │
│  ├─ Total Tasks:    ${String(stats.totalTasks).padEnd(6)} ✓ ${String(stats.completedTasks).padEnd(4)} ✗ ${String(stats.failedTasks).padEnd(4)} │
│  └─ Running Now:    ${String(stats.runningTasks).padEnd(6)} ⚡                   │
│                                                 │
│  📈 Performance Metrics                         │
│  ├─ Success Rate:   [${successBar}] ${stats.successRate.toFixed(1)}%    │
│  ├─ Throughput:     [${throughputBar}] ${stats.currentThroughput.toFixed(2)}/min │
│  ├─ Avg Task Time:  ${stats.averageTaskTime.toFixed(2)}s                      │
│  └─ Session Uptime: ${formatUptime(stats.uptime)}                   │
│                                                 │
╰─────────────────────────────────────────────────╯`;
        
        addOutput({
          id: `output-${Date.now()}`,
          timestamp: new Date(),
          type: 'output',
          content: statsText,
          metadata: { stats }
        });
        break;
      }

      case 'demo': {
        if (currentSession) {
          addOutput({
            id: `output-${Date.now()}`,
            timestamp: new Date(),
            type: 'output',
            content: 'Demo session already active or session exists. Use "stop" to end current session first.',
            metadata: {}
          });
        } else {
          startDemoSession();
        }
        break;
      }

      case 'auto-execute': {
        if (currentSession) {
          if (isAutoExecuting) {
            addOutput({
              id: `output-${Date.now()}`,
              timestamp: new Date(),
              type: 'output',
              content: 'Auto-execution is already running. Use "pause" to stop it.',
              metadata: {}
            });
          } else {
            await autoExecuteAll();
          }
        } else {
          addOutput({
            id: `output-${Date.now()}`,
            timestamp: new Date(),
            type: 'output',
            content: 'No active session. Use "start" or "demo" to begin a session.',
            metadata: {}
          });
        }
        break;
      }

      case 'pause': {
        if (isAutoExecuting) {
          pauseAutoExecution();
        } else {
          addOutput({
            id: `output-${Date.now()}`,
            timestamp: new Date(),
            type: 'output',
            content: 'No auto-execution is currently running.',
            metadata: {}
          });
        }
        break;
      }

      case 'resume': {
        if (currentSession && !isAutoExecuting) {
          resumeAutoExecution();
        } else if (isAutoExecuting) {
          addOutput({
            id: `output-${Date.now()}`,
            timestamp: new Date(),
            type: 'output',
            content: 'Auto-execution is already running.',
            metadata: {}
          });
        } else {
          addOutput({
            id: `output-${Date.now()}`,
            timestamp: new Date(),
            type: 'output',
            content: 'No active session to resume.',
            metadata: {}
          });
        }
        break;
      }

      case 'tasks': {
        const availableTasks = getAvailableTasks();
        if (availableTasks.length === 0) {
          addOutput({
            id: `output-${Date.now()}`,
            timestamp: new Date(),
            type: 'output',
            content: 'No tasks available. Use "demo" to start a session with demo tasks.',
            metadata: {}
          });
        } else {
          const taskList = availableTasks.map((task, index) => `  ${index + 1}. ${task}`).join('\n');
          addOutput({
            id: `output-${Date.now()}`,
            timestamp: new Date(),
            type: 'output',
            content: `Available tasks:\n${taskList}`,
            metadata: { availableTasks }
          });
        }
        break;
      }

      default:
        addOutput({
          id: `output-${Date.now()}`,
          timestamp: new Date(),
          type: 'error',
          content: `Unknown command: ${command.type}. Type /help for available commands or / to see suggestions.`,
          metadata: { command: command.type }
        });
    }
  };

  const handleSubmit = async (commandOverride?: string) => {
    const commandToExecute = commandOverride || input;
    await executeCommand(commandToExecute);
    if (!commandOverride) {
      setInput('');
    }
  };

  const formatTimestamp = (timestamp: Date): string => {
    return timestamp.toLocaleTimeString();
  };

  const formatUptime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const getOutputColor = (type: string): string => {
    switch (type) {
      case 'command':
        return theme.primary;
      case 'error':
        return theme.error;
      case 'system':
        return theme.success;
      default:
        return theme.text;
    }
  };

  return (
    <Box flexDirection="column" height="100%">
      {/* Header */}
      <Box borderStyle="round" borderColor={theme.replBorder} paddingX={1} marginBottom={1}>
        <Text bold color={theme.primary}>
          Autonomous Coding REPL
        </Text>
        {currentSession && (
          <Text color={theme.success}> - Session: {currentSession.id} ({currentSession.status})</Text>
        )}
        {isAutoExecuting && (
          <Text color={theme.warning}> - AUTO-EXECUTING</Text>
        )}
      </Box>

      {/* Output area */}
      <Box flexDirection="column" flexGrow={1} paddingX={1} marginBottom={1}>
        {outputs.length === 0 ? (
          <Box flexDirection="column" alignItems="center">
            <Box marginBottom={1}>
              <Text color={theme.primary}>
                {`   _____ _      _____   _____  ______ __  __  ____  
  / ____| |    |_   _| |  __ \\|  ____|  \\/  |/ __ \\ 
 | |    | |      | |   | |  | | |__  | \\  / | |  | |
 | |    | |      | |   | |  | |  __| | |\\/| | |  | |
 | |____| |____ _| |_  | |__| | |____| |  | | |__| |
  \\_____|______|_____| |_____/|______|_|  |_|\\____/ `}
              </Text>
            </Box>
            <Box flexDirection="column" alignItems="center" marginBottom={1}>
              <Text color={theme.primary} bold>
                🚀 Welcome to the Autonomous Coding REPL!
              </Text>
              <Text color={theme.textSecondary}>
                This demo showcases long-running autonomous coding sessions with real-time monitoring.
              </Text>
              <Text color={theme.warning}>
                Quick start: Type /demo to begin a demo session, then /auto-execute to watch it run!
              </Text>
              <Text color={theme.textSecondary}>
                Type / to see available commands or /help for detailed info.
              </Text>
            </Box>
          </Box>
        ) : (
          outputs.map((output) => (
            <Box key={output.id} marginBottom={0}>
              <Text color={theme.textDim}>[{formatTimestamp(output.timestamp)}] </Text>
              <Text color={getOutputColor(output.type)}>
                {output.content}
              </Text>
            </Box>
          ))
        )}
      </Box>

      {/* Input area with suggestions */}
      <Box flexDirection="column">
        <Box borderStyle="round" borderColor={theme.inputBorderActive} paddingX={1}>
          <Text color={theme.primary}>{'> '}</Text>
          <TextInput
            value={input}
            onChange={setInput}
            onSubmit={() => handleSubmit()}
            placeholder="Type / for commands..."
            focus={isInputFocused}
          />
        </Box>
        
        {/* Command suggestions */}
        {showSuggestions && (
          <Box flexDirection="column" paddingX={2} marginTop={0}>
            {getSuggestions(input).map((cmd, index) => {
              const isSelected = index === selectedSuggestion;
              return (
                <Box key={cmd.name}>
                  <Text color={isSelected ? theme.primary : theme.textDim}>
                    {isSelected ? '▸ ' : '  '}
                  </Text>
                  <Text color={isSelected ? theme.text : theme.textSecondary} bold={isSelected}>
                    /{cmd.name}
                  </Text>
                  {cmd.args && (
                    <Text color={theme.warning}> {cmd.args}</Text>
                  )}
                  <Text color={theme.textSecondary}> - {cmd.description}</Text>
                  {cmd.aliases.length > 0 && (
                    <Text color={theme.textDim} dimColor> ({cmd.aliases.join(', ')})</Text>
                  )}
                </Box>
              );
            })}
            <Box marginTop={1}>
              <Text color={theme.textDim}>
                [Tab/Enter] Complete • [↑↓] Navigate • [Esc] Cancel
              </Text>
            </Box>
          </Box>
        )}
      </Box>

      {/* Status bar */}
      <Box paddingX={1} marginTop={1}>
        <Text color={theme.textSecondary}>
          Commands: {commandHistory.length} | 
          {currentSession ? (
            <>
              Tasks: {currentSession.completedTasks}/{currentSession.totalTasks}
              {stats.runningTasks > 0 && (
                <Text color={theme.warning}> | ⚡ {stats.runningTasks} running</Text>
              )}
              {isAutoExecuting && (
                <Text color={theme.primary}> | 🤖 AUTO</Text>
              )}
            </>
          ) : ' No active session'} | 
          Ctrl+C to exit, Ctrl+L to clear
        </Text>
      </Box>
    </Box>
  );
};

export default REPL;