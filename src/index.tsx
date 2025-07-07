#!/usr/bin/env node
import React from 'react';
import { render, Text, Box } from 'ink';

const App = () => {
	return (
		<Box flexDirection="column" padding={1}>
			<Text color="green" bold>
				🚀 CLI Demo - Interactive Terminal UI
			</Text>
			<Text>
				Welcome to the interactive terminal UI demo!
			</Text>
			<Text dimColor>
				Built with Ink, React, and Zustand
			</Text>
		</Box>
	);
};

render(<App />);