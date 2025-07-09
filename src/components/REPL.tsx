import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { useSessionStore } from '../stores/sessionStore.js';
import { REPLCommand, REPLCommandType } from '../types/index.js';

interface REPLProps {
  onExit?: () => void;
}

/**
 * REPL (Read-Eval-Print Loop) component for autonomous coding sessions
 * Provides command-line interface for interacting with coding sessions
 */
const REPL: React.FC<REPLProps> = ({ onExit }) => {
  const [input, setInput] = useState('');
  const [isInputFocused] = useState(true);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

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

  // Handle keyboard navigation
  useInput((input, key) => {
    if (!isInputFocused) {
      return;
    }

    // Handle command history navigation
    if (key.upArrow && commandHistory.length > 0) {
      const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
      setHistoryIndex(newIndex);
      setInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
    } else if (key.downArrow && historyIndex >= 0) {
      const newIndex = historyIndex > 0 ? historyIndex - 1 : -1;
      setHistoryIndex(newIndex);
      setInput(newIndex >= 0 ? commandHistory[commandHistory.length - 1 - newIndex] || '' : '');
    }

    // Handle Ctrl+C for exit
    if (key.ctrl && input === 'c') {
      if (onExit) {
        onExit();
      }
    }

    // Handle Ctrl+L for clear
    if (key.ctrl && input === 'l') {
      clearOutput();
    }
  });

  const parseCommand = (commandLine: string): REPLCommand => {
    const parts = commandLine.trim().split(/\s+/);
    const type = parts[0] as REPLCommandType;
    const args = parts.slice(1);

    return {
      type,
      args,
      timestamp: new Date()
    };
  };

  const executeCommand = async (commandLine: string) => {
    if (!commandLine.trim()) {
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
        const helpText = `Available commands:
  start [sessionId]  - Start a new coding session
  demo              - Start a demo session with autonomous coding
  stop              - Stop the current session
  status            - Show session status
  clear             - Clear output
  help              - Show this help message
  task <name>       - Execute a specific task
  monitor           - Show execution statistics
  execute <task>    - Execute a task (alias for task)
  auto-execute      - Start autonomous execution of all pending tasks
  pause             - Pause autonomous execution
  resume            - Resume autonomous execution
  tasks             - List available tasks
  
Navigation:
  ↑/↓ arrows       - Navigate command history
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
          content: `Unknown command: ${command.type}. Type "help" for available commands.`,
          metadata: { command: command.type }
        });
    }
  };

  const handleSubmit = async () => {
    await executeCommand(input);
    setInput('');
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
        return 'cyan';
      case 'error':
        return 'red';
      case 'system':
        return 'green';
      default:
        return 'white';
    }
  };

  return (
    <Box flexDirection="column" height="100%">
      {/* Header */}
      <Box borderStyle="single" paddingX={1} marginBottom={1}>
        <Text bold color="cyan">
          Autonomous Coding REPL
        </Text>
        {currentSession && (
          <Text color="green"> - Session: {currentSession.id} ({currentSession.status})</Text>
        )}
        {isAutoExecuting && (
          <Text color="yellow"> - AUTO-EXECUTING</Text>
        )}
      </Box>

      {/* Output area */}
      <Box flexDirection="column" flexGrow={1} paddingX={1} marginBottom={1}>
        {outputs.length === 0 ? (
          <Box flexDirection="column" alignItems="center">
            <Box marginBottom={1}>
              <Text color="cyan">
                {`   _____ _      _____   _____  ______ __  __  ____  
  / ____| |    |_   _| |  __ \\|  ____|  \\/  |/ __ \\ 
 | |    | |      | |   | |  | | |__  | \\  / | |  | |
 | |    | |      | |   | |  | |  __| | |\\/| | |  | |
 | |____| |____ _| |_  | |__| | |____| |  | | |__| |
  \\_____|______|_____| |_____/|______|_|  |_|\\____/ `}
              </Text>
            </Box>
            <Box flexDirection="column" alignItems="center" marginBottom={1}>
              <Text color="cyan" bold>
                🚀 Welcome to the Autonomous Coding REPL!
              </Text>
              <Text color="gray">
                This demo showcases long-running autonomous coding sessions with real-time monitoring.
              </Text>
              <Text color="yellow">
                Quick start: Type &quot;demo&quot; to begin a demo session, then &quot;auto-execute&quot; to watch it run!
              </Text>
              <Text color="gray">
                Type &quot;help&quot; for all available commands.
              </Text>
            </Box>
          </Box>
        ) : (
          outputs.map((output) => (
            <Box key={output.id} marginBottom={0}>
              <Text color="gray">[{formatTimestamp(output.timestamp)}] </Text>
              <Text color={getOutputColor(output.type)}>
                {output.content}
              </Text>
            </Box>
          ))
        )}
      </Box>

      {/* Input area */}
      <Box borderStyle="single" paddingX={1}>
        <Text color="cyan">{'> '}</Text>
        <TextInput
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          placeholder="Enter command..."
          focus={isInputFocused}
        />
      </Box>

      {/* Status bar */}
      <Box paddingX={1} marginTop={1}>
        <Text color="gray">
          Commands: {commandHistory.length} | 
          {currentSession ? (
            <>
              Tasks: {currentSession.completedTasks}/{currentSession.totalTasks}
              {stats.runningTasks > 0 && (
                <Text color="yellow"> | ⚡ {stats.runningTasks} running</Text>
              )}
              {isAutoExecuting && (
                <Text color="cyan"> | 🤖 AUTO</Text>
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