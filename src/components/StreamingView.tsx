import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { useSessionStore } from '../stores/sessionStore.js';
import { StreamingUpdate, TaskEvent, REPLOutput } from '../types/index.js';

interface StreamingViewProps {
  maxItems?: number;
  autoScroll?: boolean;
  showTimestamps?: boolean;
  filterType?: 'all' | 'task' | 'event' | 'output' | 'stats';
}

/**
 * StreamingView displays real-time streaming updates from autonomous coding sessions
 * Shows tasks, events, statistics, and output in a continuous scrolling view
 */
const StreamingView: React.FC<StreamingViewProps> = ({
  maxItems = 100,
  autoScroll: _autoScroll = true,
  showTimestamps = true,
  filterType = 'all'
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [searchTerm, _setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'normal' | 'compact' | 'detailed'>('normal');

  const {
    streamingUpdates,
    events,
    outputs,
    stats,
    currentSession
  } = useSessionStore();

  // Handle keyboard shortcuts
  useInput((input, key) => {
    if (key.ctrl && input === 'p') {
      setIsPaused(!isPaused);
    } else if (key.ctrl && input === 'c') {
      // Toggle compact view
      setViewMode(prev => prev === 'compact' ? 'normal' : 'compact');
    } else if (key.ctrl && input === 'd') {
      // Toggle detailed view
      setViewMode(prev => prev === 'detailed' ? 'normal' : 'detailed');
    }
  });

  // Filter and process streaming updates
  const getFilteredUpdates = (): StreamingUpdate[] => {
    let filtered = streamingUpdates;

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(update => update.type === filterType);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(update => {
        const searchContent = JSON.stringify(update.data).toLowerCase();
        return searchContent.includes(searchTerm.toLowerCase());
      });
    }

    // Limit items
    return filtered.slice(-maxItems);
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp: Date): string => {
    return timestamp.toLocaleTimeString();
  };

  // Get update type icon
  const getUpdateIcon = (type: string): string => {
    switch (type) {
      case 'task':
        return '🎯';
      case 'event':
        return '⚡';
      case 'stats':
        return '📊';
      case 'output':
        return '📝';
      default:
        return '📄';
    }
  };

  // Get update type color
  const getUpdateColor = (type: string): string => {
    switch (type) {
      case 'task':
        return 'blue';
      case 'event':
        return 'green';
      case 'stats':
        return 'yellow';
      case 'output':
        return 'white';
      default:
        return 'gray';
    }
  };

  // Render task event
  const renderTaskEvent = (event: TaskEvent): string => {
    const progress = event.progress !== undefined ? ` (${event.progress}%)` : '';
    return `${event.taskName}: ${event.content}${progress}`;
  };

  // Render REPL output
  const renderREPLOutput = (output: REPLOutput): string => {
    return output.content;
  };

  // Render stats update
  const renderStatsUpdate = (data: Record<string, unknown>): string => {
    const statsData = data as { totalTasks?: number; completedTasks?: number; successRate?: number };
    return `Tasks: ${statsData.totalTasks || 0} | Completed: ${statsData.completedTasks || 0} | Success: ${(statsData.successRate || 0).toFixed(1)}%`;
  };

  // Render update content based on type and view mode
  const renderUpdateContent = (update: StreamingUpdate): string => {
    switch (update.type) {
      case 'task':
      case 'event':
        return renderTaskEvent(update.data as TaskEvent);
      case 'output':
        return renderREPLOutput(update.data as REPLOutput);
      case 'stats':
        return renderStatsUpdate(update.data as Record<string, unknown>);
      default:
        return JSON.stringify(update.data);
    }
  };

  // Get compact view content
  const getCompactContent = (update: StreamingUpdate): string => {
    const content = renderUpdateContent(update);
    return content.length > 50 ? `${content.substring(0, 50)}...` : content;
  };

  // Get detailed view content
  const getDetailedContent = (update: StreamingUpdate): string => {
    const basicContent = renderUpdateContent(update);
    if (viewMode === 'detailed') {
      return `${basicContent}\n  Data: ${JSON.stringify(update.data, null, 2)}`;
    }
    return basicContent;
  };

  const filteredUpdates = getFilteredUpdates();

  return (
    <Box flexDirection="column" height="100%">
      {/* Header */}
      <Box borderStyle="single" paddingX={1} marginBottom={1}>
        <Text bold color="cyan">
          Streaming View
        </Text>
        {isPaused && (
          <Text color="yellow"> [PAUSED]</Text>
        )}
        <Text color="gray"> | Mode: {viewMode}</Text>
        <Text color="gray"> | Filter: {filterType}</Text>
        {currentSession && (
          <Text color="green"> | Session: {currentSession.id}</Text>
        )}
      </Box>

      {/* Controls */}
      <Box paddingX={1} marginBottom={1}>
        <Text color="gray">
          Ctrl+P: {isPaused ? 'Resume' : 'Pause'} | 
          Ctrl+C: Compact | 
          Ctrl+D: Detailed | 
          Updates: {filteredUpdates.length}/{streamingUpdates.length}
        </Text>
      </Box>

      {/* Streaming content */}
      <Box flexDirection="column" flexGrow={1} paddingX={1}>
        <Box flexDirection="column">
          {filteredUpdates.length === 0 ? (
            <Box>
              <Text color="gray">
                No streaming updates yet. Start a session to see real-time updates.
              </Text>
            </Box>
          ) : (
            filteredUpdates.map((update) => (
              <Box key={update.id} marginBottom={viewMode === 'detailed' ? 1 : 0}>
                {showTimestamps && (
                  <Text color="gray">[{formatTimestamp(update.timestamp)}] </Text>
                )}
                <Text>{getUpdateIcon(update.type)} </Text>
                <Text color={getUpdateColor(update.type)}>
                  {viewMode === 'compact' 
                    ? getCompactContent(update)
                    : viewMode === 'detailed'
                    ? getDetailedContent(update)
                    : renderUpdateContent(update)
                  }
                </Text>
              </Box>
            ))
          )}
        </Box>
      </Box>

      {/* Status bar */}
      <Box borderStyle="single" paddingX={1} marginTop={1}>
        <Text color="gray">
          Session: {currentSession?.status || 'None'} | 
          Events: {events.length} | 
          Outputs: {outputs.length} | 
          Updates: {streamingUpdates.length}
          {streamingUpdates.length > 0 && (
            <Text> | Last: {formatTimestamp(streamingUpdates[streamingUpdates.length - 1].timestamp)}</Text>
          )}
        </Text>
      </Box>

      {/* Live indicators */}
      <Box paddingX={1} marginTop={1}>
        <Text color="gray">
          Live Stats: 
          <Text color="cyan"> Tasks: {stats.totalTasks}</Text>
          <Text color="green"> ✓ {stats.completedTasks}</Text>
          <Text color="red"> ✗ {stats.failedTasks}</Text>
          <Text color="yellow"> ⚡ {stats.runningTasks}</Text>
          <Text color="blue"> Success: {stats.successRate.toFixed(1)}%</Text>
        </Text>
      </Box>
    </Box>
  );
};

export default StreamingView;