# Agent Instructions

This file gives guidance to agentic coding tools on codebase structure, build/test commands, architecture, etc.

## Project Context
Interactive terminal UI demo application built with Ink, React, and Zustand for state management.

## Technology Stack
- Node.js
- TypeScript 5.0
- React 18.2.0
- Ink 4.4.1 (React for CLI)
- Zustand 4.4.0 (State Management)
- Various Ink UI components

## Coding Standards
- TypeScript strict mode enabled
- React functional components with hooks
- ESModules (type: "module" in package.json)
- No unused locals or parameters
- Consistent casing in file names

## Build and Test Commands
- `npm start` - Run the application
- `npm run dev` - Run in watch mode for development
- `npm run build` - Build the TypeScript project
- `npm run typecheck` - Run TypeScript type checking
- `npm run lint` - Run linting (currently using tsc --noEmit)

## Additional Notes
- Entry point is src/index.tsx
- Project structure follows:
  - src/components/ - UI components
  - src/stores/ - Zustand state stores
  - src/types/ - TypeScript type definitions
