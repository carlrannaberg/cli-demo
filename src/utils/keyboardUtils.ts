type DebouncedFunction<T extends (...args: any[]) => any> = (
  ...args: Parameters<T>
) => void;

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): DebouncedFunction<T> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return function (...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, delay);
  };
}

export interface KeyMeta {
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
}

export function isModifierKey(_input: string, key: KeyMeta): boolean {
  return !!(key.ctrl || key.alt || key.shift || key.meta);
}

export function createKeyHandler(
  handlers: Record<string, (input: string, key: KeyMeta) => void>,
  debounceDelay = 50
) {
  const debouncedHandlers = Object.entries(handlers).reduce(
    (acc, [keyCombo, handler]) => {
      acc[keyCombo] = debounce(handler, debounceDelay);
      return acc;
    },
    {} as Record<string, DebouncedFunction<typeof handlers[string]>>
  );
  
  return (input: string, key: KeyMeta) => {
    let keyCombo = '';
    
    if (key.ctrl) keyCombo += 'ctrl+';
    if (key.alt) keyCombo += 'alt+';
    if (key.shift) keyCombo += 'shift+';
    if (key.meta) keyCombo += 'meta+';
    
    keyCombo += input.toLowerCase();
    
    if (debouncedHandlers[keyCombo]) {
      debouncedHandlers[keyCombo](input, key);
    }
  };
}