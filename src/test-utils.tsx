import React from 'react';
import { render } from 'ink-testing-library';
import type { RenderOptions } from 'ink-testing-library';

export * from 'ink-testing-library';

export interface CustomRenderOptions extends Omit<RenderOptions, 'initialHeight' | 'initialWidth'> {
  initialHeight?: number;
  initialWidth?: number;
}

export function customRender(
  ui: React.ReactElement,
  options?: CustomRenderOptions
) {
  const defaultOptions: RenderOptions = {
    initialHeight: options?.initialHeight ?? 24,
    initialWidth: options?.initialWidth ?? 80,
    ...options,
  };

  return render(ui, defaultOptions);
}

export { customRender as render };

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