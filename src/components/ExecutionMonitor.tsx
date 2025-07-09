import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import { useSessionStore } from '../stores/sessionStore.js';
import { TaskEvent } from '../types/index.js';

interface ExecutionMonitorProps {
  isVisible?: boolean;
  refreshInterval?: number;
}

/**
 * ExecutionMonitor displays real-time task execution statistics and events
 * Provides monitoring capabilities for autonomous coding sessions
 */
const ExecutionMonitor: React.FC<ExecutionMonitorProps> = ({ 
  isVisible = true, 
  refreshInterval = 1000 
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [_selectedView, _setSelectedView] = useState<'stats' | 'events' | 'recent'>('stats');

  const {
    currentSession,
    events,
    stats,
    streamingUpdates
  } = useSessionStore();

  // Update current time for uptime calculation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  // Calculate session uptime
  const getSessionUptime = (): string => {
    if (!currentSession) {
      return '0s';
    }
    
    const uptimeMs = currentTime.getTime() - currentSession.startTime.getTime();
    const uptimeSeconds = Math.floor(uptimeMs / 1000);
    const uptimeMinutes = Math.floor(uptimeSeconds / 60);
    const uptimeHours = Math.floor(uptimeMinutes / 60);
    
    if (uptimeHours > 0) {
      return `${uptimeHours}h ${uptimeMinutes % 60}m ${uptimeSeconds % 60}s`;
    } else if (uptimeMinutes > 0) {
      return `${uptimeMinutes}m ${uptimeSeconds % 60}s`;
    } else {
      return `${uptimeSeconds}s`;
    }
  };

  // Get recent events (last 10)
  const getRecentEvents = (): TaskEvent[] => {
    return events.slice(-10).reverse();
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp: Date): string => {
    return timestamp.toLocaleTimeString();
  };

  // Get event icon based on type
  const getEventIcon = (type: string): string => {
    switch (type) {
      case 'started':
        return '🚀';
      case 'progress':
        return '⚙️';
      case 'completed':
        return '✅';
      case 'failed':
        return '❌';
      case 'output':
        return '📄';
      case 'error':
        return '🔥';
      default:
        return '📝';
    }
  };

  // Get status color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active':
        return 'green';
      case 'paused':
        return 'yellow';
      case 'completed':
        return 'blue';
      case 'failed':
        return 'red';
      default:
        return 'gray';
    }
  };

  // Calculate throughput (tasks per minute)
  const calculateThroughput = (): number => {
    if (!currentSession || !stats.completedTasks) {
      return 0;
    }
    
    const uptimeMs = currentTime.getTime() - currentSession.startTime.getTime();
    const uptimeMinutes = uptimeMs / (1000 * 60);
    
    return uptimeMinutes > 0 ? stats.completedTasks / uptimeMinutes : 0;
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Box flexDirection="column" height="100%" paddingX={1}>
      {/* Header */}
      <Box borderStyle="single" paddingX={1} marginBottom={1}>
        <Text bold color="cyan">Execution Monitor</Text>
        {currentSession && (
          <Text color={getStatusColor(currentSession.status)}>
            {' '}• {currentSession.status.toUpperCase()}
          </Text>
        )}
      </Box>

      {/* Session Info */}
      <Box flexDirection="column" marginBottom={1}>
        <Text bold color="white">Session Information</Text>
        {currentSession ? (
          <Box flexDirection="column" paddingLeft={2}>
            <Text>ID: <Text color="cyan">{currentSession.id}</Text></Text>
            <Text>Status: <Text color={getStatusColor(currentSession.status)}>{currentSession.status}</Text></Text>
            <Text>Phase: <Text color="yellow">{currentSession.currentPhase}</Text></Text>
            <Text>Uptime: <Text color="green">{getSessionUptime()}</Text></Text>
            <Text>Started: <Text color="gray">{formatTimestamp(currentSession.startTime)}</Text></Text>
          </Box>
        ) : (
          <Box paddingLeft={2}>
            <Text color="gray">No active session</Text>
          </Box>
        )}
      </Box>

      {/* Statistics */}
      <Box flexDirection="column" marginBottom={1}>
        <Text bold color="white">Execution Statistics</Text>
        <Box flexDirection="column" paddingLeft={2}>
          <Box>
            <Text>Total Tasks: <Text color="cyan">{stats.totalTasks}</Text></Text>
            <Text> | Completed: <Text color="green">{stats.completedTasks}</Text></Text>
            <Text> | Failed: <Text color="red">{stats.failedTasks}</Text></Text>
          </Box>
          <Box>
            <Text>Running: <Text color="yellow">{stats.runningTasks}</Text></Text>
            <Text> | Success Rate: <Text color="green">{stats.successRate.toFixed(1)}%</Text></Text>
          </Box>
          <Box>
            <Text>Throughput: <Text color="blue">{calculateThroughput().toFixed(2)} tasks/min</Text></Text>
            <Text> | Avg Time: <Text color="magenta">{stats.averageTaskTime.toFixed(2)}s</Text></Text>
          </Box>
        </Box>
      </Box>

      {/* Progress Bar */}
      {currentSession && currentSession.totalTasks > 0 && (
        <Box flexDirection="column" marginBottom={1}>
          <Text bold color="white">Progress</Text>
          <Box paddingLeft={2}>
            <Box width={30}>
              <Text>
                {Array.from({ length: 30 }, (_, i) => {
                  const progress = currentSession.completedTasks / currentSession.totalTasks;
                  const position = i / 30;
                  return position <= progress ? '█' : '░';
                }).join('')}
              </Text>
            </Box>
            <Text color="cyan"> {((currentSession.completedTasks / currentSession.totalTasks) * 100).toFixed(1)}%</Text>
          </Box>
        </Box>
      )}

      {/* Recent Events */}
      <Box flexDirection="column" flexGrow={1}>
        <Text bold color="white">Recent Events</Text>
        <Box flexDirection="column" paddingLeft={2}>
          {getRecentEvents().length === 0 ? (
            <Text color="gray">No recent events</Text>
          ) : (
            getRecentEvents().map((event) => (
              <Box key={event.id} marginBottom={0}>
                <Text color="gray">[{formatTimestamp(event.timestamp)}] </Text>
                <Text>{getEventIcon(event.type)} </Text>
                <Text color="white">{event.taskName}: </Text>
                <Text color="gray">{event.content}</Text>
                {event.progress !== undefined && (
                  <Text color="cyan"> ({event.progress}%)</Text>
                )}
              </Box>
            ))
          )}
        </Box>
      </Box>

      {/* Streaming Updates Indicator */}
      <Box borderStyle="single" paddingX={1} marginTop={1}>
        <Text color="gray">
          Updates: {streamingUpdates.length} | 
          Events: {events.length} | 
          Last Update: {streamingUpdates.length > 0 ? formatTimestamp(streamingUpdates[streamingUpdates.length - 1].timestamp) : 'Never'}
        </Text>
      </Box>
    </Box>
  );
};

export default ExecutionMonitor;