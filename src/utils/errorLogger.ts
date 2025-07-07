import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface ErrorLogEntry {
	timestamp: string;
	level: 'error' | 'warning' | 'info';
	message: string;
	stack?: string;
	context?: Record<string, unknown>;
}

export class ErrorLogger {
	private static instance: ErrorLogger;
	private logFilePath: string;
	private logQueue: ErrorLogEntry[] = [];
	private isWriting = false;

	private constructor() {
		const logsDir = path.join(__dirname, '../../logs');
		if (!fs.existsSync(logsDir)) {
			fs.mkdirSync(logsDir, { recursive: true });
		}
		
		const date = new Date().toISOString().split('T')[0];
		this.logFilePath = path.join(logsDir, `errors-${date}.log`);
	}

	static getInstance(): ErrorLogger {
		if (!ErrorLogger.instance) {
			ErrorLogger.instance = new ErrorLogger();
		}
		return ErrorLogger.instance;
	}

	async log(entry: Omit<ErrorLogEntry, 'timestamp'>): Promise<void> {
		const logEntry: ErrorLogEntry = {
			...entry,
			timestamp: new Date().toISOString()
		};

		this.logQueue.push(logEntry);
		
		if (!this.isWriting) {
			await this.flushQueue();
		}
	}

	private async flushQueue(): Promise<void> {
		if (this.logQueue.length === 0 || this.isWriting) {
			return;
		}

		this.isWriting = true;
		const entries = [...this.logQueue];
		this.logQueue = [];

		try {
			const logContent = entries
				.map(entry => JSON.stringify(entry))
				.join('\n') + '\n';

			await fs.promises.appendFile(this.logFilePath, logContent);
		} catch (error) {
			console.error('Failed to write to error log:', error);
			this.logQueue.unshift(...entries);
		} finally {
			this.isWriting = false;
		}
	}

	async logError(error: Error, context?: Record<string, unknown>): Promise<void> {
		await this.log({
			level: 'error',
			message: error.message,
			stack: error.stack,
			context
		});
	}

	async logWarning(message: string, context?: Record<string, unknown>): Promise<void> {
		await this.log({
			level: 'warning',
			message,
			context
		});
	}

	async logInfo(message: string, context?: Record<string, unknown>): Promise<void> {
		await this.log({
			level: 'info',
			message,
			context
		});
	}

	getLogFilePath(): string {
		return this.logFilePath;
	}
}

export const errorLogger = ErrorLogger.getInstance();