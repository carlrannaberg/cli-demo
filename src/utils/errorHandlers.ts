import { errorLogger } from './errorLogger.js';

export interface ErrorHandler {
	handle(error: Error, context?: Record<string, unknown>): Promise<void>;
	canHandle(error: Error): boolean;
}

export class FileSystemErrorHandler implements ErrorHandler {
	canHandle(error: Error): boolean {
		return error.message.includes('ENOENT') ||
			error.message.includes('EACCES') ||
			error.message.includes('EPERM') ||
			error.message.includes('ENOSPC');
	}

	async handle(error: Error, context?: Record<string, unknown>): Promise<void> {
		await errorLogger.logError(error, { ...context, type: 'filesystem' });
		
		let userMessage = 'File system error occurred';
		
		if (error.message.includes('ENOENT')) {
			userMessage = 'File or directory not found';
		} else if (error.message.includes('EACCES') || error.message.includes('EPERM')) {
			userMessage = 'Permission denied. Please check file permissions';
		} else if (error.message.includes('ENOSPC')) {
			userMessage = 'No space left on device';
		}

		throw new Error(userMessage);
	}
}

export class NetworkErrorHandler implements ErrorHandler {
	canHandle(error: Error): boolean {
		return error.message.includes('ETIMEDOUT') ||
			error.message.includes('ECONNREFUSED') ||
			error.message.includes('ENOTFOUND') ||
			error.message.includes('fetch');
	}

	async handle(error: Error, context?: Record<string, unknown>): Promise<void> {
		await errorLogger.logError(error, { ...context, type: 'network' });
		
		let userMessage = 'Network error occurred';
		
		if (error.message.includes('ETIMEDOUT')) {
			userMessage = 'Request timed out. Please check your connection';
		} else if (error.message.includes('ECONNREFUSED')) {
			userMessage = 'Connection refused. The server may be down';
		} else if (error.message.includes('ENOTFOUND')) {
			userMessage = 'Server not found. Please check the URL';
		}

		throw new Error(userMessage);
	}
}

export class StateCorruptionErrorHandler implements ErrorHandler {
	canHandle(error: Error): boolean {
		return error.message.includes('state') ||
			error.message.includes('store') ||
			error.message.includes('undefined') ||
			error.message.includes('null');
	}

	async handle(error: Error, context?: Record<string, unknown>): Promise<void> {
		await errorLogger.logError(error, { ...context, type: 'state_corruption' });
		
		throw new Error('Application state error. Please restart the application');
	}
}

export class ErrorHandlerChain {
	private handlers: ErrorHandler[] = [];

	addHandler(handler: ErrorHandler): void {
		this.handlers.push(handler);
	}

	async handle(error: Error, context?: Record<string, unknown>): Promise<void> {
		for (const handler of this.handlers) {
			if (handler.canHandle(error)) {
				await handler.handle(error, context);
				return;
			}
		}

		await errorLogger.logError(error, context);
		throw error;
	}
}

export const defaultErrorChain = new ErrorHandlerChain();
defaultErrorChain.addHandler(new FileSystemErrorHandler());
defaultErrorChain.addHandler(new NetworkErrorHandler());
defaultErrorChain.addHandler(new StateCorruptionErrorHandler());

export async function handleError(
	error: unknown,
	context?: Record<string, unknown>
): Promise<string> {
	const err = error instanceof Error ? error : new Error(String(error));
	
	try {
		await defaultErrorChain.handle(err, context);
		return err.message;
	} catch (handledError) {
		if (handledError instanceof Error) {
			return handledError.message;
		}
		return 'An unexpected error occurred';
	}
}

export function createRetryHandler<T>(
	fn: () => Promise<T>,
	maxRetries = 3,
	delay = 1000
): () => Promise<T> {
	return async () => {
		let lastError: Error | undefined;
		
		for (let i = 0; i <= maxRetries; i++) {
			try {
				return await fn();
			} catch (error) {
				lastError = error instanceof Error ? error : new Error(String(error));
				
				if (i < maxRetries) {
					await errorLogger.logWarning(`Retry attempt ${i + 1} of ${maxRetries}`, {
						error: lastError.message
					});
					await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
				}
			}
		}

		throw lastError || new Error('Failed after retries');
	};
}