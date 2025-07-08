import { useUIStore } from '../stores/uiStore.js';
import { errorLogger } from './errorLogger.js';

interface ErrorToastOptions {
	title?: string;
	duration?: number;
	showRecovery?: boolean;
	actions?: Array<{
		label: string;
		action: () => void;
	}>;
}

export async function showErrorToast(
	error: unknown,
	options: ErrorToastOptions = {}
): Promise<void> {
	const err = error instanceof Error ? error : new Error(String(error));
	const { showToast } = useUIStore.getState();
	
	// Log the error
	await errorLogger.logError(err, {
		context: 'error_toast',
		options
	});
	
	// Prepare error message
	let message = err.message;
	
	// Add recovery suggestions based on error type
	if (options.showRecovery) {
		if (message.includes('EACCES') || message.includes('EPERM')) {
			message += '\n• Check file permissions';
		} else if (message.includes('ENOSPC')) {
			message += '\n• Free up disk space';
		} else if (message.includes('ETIMEDOUT')) {
			message += '\n• Check your internet connection';
		} else if (message.includes('state')) {
			message += '\n• Try restarting the application';
		}
	}
	
	showToast(
		options.title ? `${options.title}: ${message}` : message,
		'error',
		options.duration || 5000
	);
}

export async function showWarningToast(
	message: string,
	options: { duration?: number } = {}
): Promise<void> {
	const { showToast } = useUIStore.getState();
	
	await errorLogger.logWarning(message, {
		context: 'warning_toast'
	});
	
	showToast(
		message,
		'warning',
		options.duration || 4000
	);
}

export async function showSuccessToast(
	message: string,
	options: { duration?: number } = {}
): Promise<void> {
	const { showToast } = useUIStore.getState();
	
	showToast(
		message,
		'success',
		options.duration || 3000
	);
}

export async function showInfoToast(
	message: string,
	options: { duration?: number } = {}
): Promise<void> {
	const { showToast } = useUIStore.getState();
	
	showToast(
		message,
		'info',
		options.duration || 3000
	);
}