import { useEffect, useState } from 'react';
import { useStdout } from 'ink';
import { errorLogger } from './errorLogger.js';
import { useUIStore } from '../stores/uiStore.js';

interface TerminalSize {
	columns: number;
	rows: number;
}

export function useTerminalResize() {
	const { stdout } = useStdout();
	const { showToast } = useUIStore();
	const [terminalSize, setTerminalSize] = useState<TerminalSize>({
		columns: stdout?.columns || 80,
		rows: stdout?.rows || 24
	});

	useEffect(() => {
		if (!stdout) {return;}

		const handleResize = () => {
			try {
				const newSize = {
					columns: stdout.columns || 80,
					rows: stdout.rows || 24
				};

				setTerminalSize(newSize);

				if (newSize.columns < 60 || newSize.rows < 10) {
					showToast(
						'Terminal size too small. Min: 60x10',
						'warning',
						5000
					);
					
					errorLogger.logWarning('Terminal resized to insufficient size', {
						columns: newSize.columns,
						rows: newSize.rows,
						minimum: { columns: 60, rows: 10 }
					});
				}
			} catch (error) {
				errorLogger.logError(
					error instanceof Error ? error : new Error(String(error)),
					{ context: 'terminal_resize' }
				);
				
				showToast(
					'Error handling terminal resize',
					'error',
					3000
				);
			}
		};

		stdout.on('resize', handleResize);

		handleResize();

		return () => {
			stdout.off('resize', handleResize);
		};
	}, [stdout, showToast]);

	return terminalSize;
}