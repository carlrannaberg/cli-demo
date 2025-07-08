import React from 'react';
import { EventEmitter } from 'node:events';

export interface CustomRenderOptions {
  initialHeight?: number;
  initialWidth?: number;
}

// Define interfaces for the test utilities that match ink-testing-library's public API
interface TestStdout extends EventEmitter {
  readonly frames: string[];
  write(frame: string): void;
  lastFrame(): string | undefined;
}

interface TestStderr extends EventEmitter {
  readonly frames: string[];
  write(frame: string): void;
  lastFrame(): string | undefined;
}

interface TestStdin extends EventEmitter {
  isTTY: boolean;
  data: string | null;
  write(data: string): void;
  setEncoding(): void;
  setRawMode(): void;
  resume(): void;
  pause(): void;
  ref(): void;
  unref(): void;
  read(): string | null;
}

export interface RenderResult {
  rerender: (tree: React.ReactElement) => void;
  unmount: () => void;
  cleanup: () => void;
  stdout: TestStdout;
  stderr: TestStderr;
  stdin: TestStdin;
  frames: string[];
  lastFrame: () => string | undefined;
}

// Wrapper functions that avoid direct re-exports
export async function render(ui: React.ReactElement, _options?: CustomRenderOptions): Promise<RenderResult> {
  // Use dynamic import to avoid TypeScript issues with module exports
  const inkTestingLibrary = await import('ink-testing-library');
  return inkTestingLibrary.render(ui) as RenderResult;
}

export async function cleanup() {
  const inkTestingLibrary = await import('ink-testing-library');
  return inkTestingLibrary.cleanup();
}

export function waitFor(fn: () => void | Promise<void>, timeout = 1000): Promise<void> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const check = async () => {
      try {
        await fn();
        resolve();
      } catch (error) {
        if (Date.now() - startTime > timeout) {
          reject(error);
        } else {
          setTimeout(check, 50);
        }
      }
    };
    
    check();
  });
}