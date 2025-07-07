import React, { Component, ReactNode } from 'react';
import { Box, Text } from 'ink';
import type { ErrorInfo } from 'react';

interface Props {
	children: ReactNode;
	onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
	hasError: boolean;
	error: Error | null;
	errorInfo: ErrorInfo | null;
	errorCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			hasError: false,
			error: null,
			errorInfo: null,
			errorCount: 0
		};
	}

	static getDerivedStateFromError(error: Error): Partial<State> {
		return {
			hasError: true,
			error
		};
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		const { onError } = this.props;
		const { errorCount } = this.state;

		this.setState({
			errorInfo,
			errorCount: errorCount + 1
		});

		if (onError) {
			onError(error, errorInfo);
		}

		console.error('ErrorBoundary caught an error:', error, errorInfo);
	}

	handleRestart = () => {
		this.setState({
			hasError: false,
			error: null,
			errorInfo: null
		});
	};

	handleExit = () => {
		process.exit(1);
	};

	render() {
		const { hasError, error, errorInfo, errorCount } = this.state;
		const { children } = this.props;

		if (hasError && error) {
			return (
				<Box flexDirection="column" paddingY={1} paddingX={2}>
					<Box marginBottom={1}>
						<Text color="red" bold>
							⚠️  Application Error
						</Text>
					</Box>

					<Box marginBottom={1}>
						<Text color="yellow">
							{error.message || 'An unexpected error occurred'}
						</Text>
					</Box>

					{errorInfo && (
						<Box marginBottom={1} flexDirection="column">
							<Text dimColor>Stack trace:</Text>
							<Box marginLeft={2}>
								<Text dimColor>
									{errorInfo.componentStack.split('\n').slice(0, 5).join('\n')}
								</Text>
							</Box>
						</Box>
					)}

					<Box marginTop={1}>
						<Text dimColor>
							Error count: {errorCount} | Press 'r' to restart, 'q' to quit
						</Text>
					</Box>

					<Box marginTop={1} flexDirection="column">
						<Text color="cyan">Recovery suggestions:</Text>
						<Box marginLeft={2} flexDirection="column">
							<Text>• Try restarting the application</Text>
							<Text>• Check your terminal size</Text>
							<Text>• Verify file permissions</Text>
							<Text>• Check available disk space</Text>
						</Box>
					</Box>
				</Box>
			);
		}

		return children;
	}
}