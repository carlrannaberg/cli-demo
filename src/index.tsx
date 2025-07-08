import React from 'react';
import { render } from 'ink';
import App from './components/App.js';
import { ErrorBoundary } from './components/ErrorBoundary.js';
import { errorLogger } from './utils/errorLogger.js';

const handleError = async (error: Error, errorInfo: React.ErrorInfo) => {
	await errorLogger.logError(error, {
		componentStack: errorInfo.componentStack,
		location: 'root'
	});
};

process.on('uncaughtException', async (error) => {
	await errorLogger.logError(error, { type: 'uncaughtException' });
	console.error('Uncaught Exception:', error);
	process.exit(1);
});

process.on('unhandledRejection', async (reason, promise) => {
	const error = new Error(`Unhandled Rejection: ${reason}`);
	await errorLogger.logError(error, { 
		type: 'unhandledRejection',
		promise: String(promise)
	});
	console.error('Unhandled Rejection:', reason);
	process.exit(1);
});

render(
	<ErrorBoundary onError={handleError}>
		<App />
	</ErrorBoundary>
);