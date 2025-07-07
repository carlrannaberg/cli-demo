export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = undefined;
      func(...args);
    };
    
    if (timeout !== undefined) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

export class CircularBuffer<T> {
  private buffer: T[] = [];
  private writeIndex = 0;
  private isFull = false;
  
  constructor(private readonly maxSize: number) {}
  
  push(item: T): void {
    this.buffer[this.writeIndex] = item;
    this.writeIndex = (this.writeIndex + 1) % this.maxSize;
    
    if (this.writeIndex === 0) {
      this.isFull = true;
    }
  }
  
  getAll(): T[] {
    if (!this.isFull) {
      return this.buffer.slice(0, this.writeIndex);
    }
    
    return [
      ...this.buffer.slice(this.writeIndex),
      ...this.buffer.slice(0, this.writeIndex)
    ];
  }
  
  clear(): void {
    this.buffer = [];
    this.writeIndex = 0;
    this.isFull = false;
  }
  
  get length(): number {
    return this.isFull ? this.maxSize : this.writeIndex;
  }
}

export function batchUpdates<T extends (...args: any[]) => void>(
  func: T,
  delay = 0
): T {
  let pendingArgs: Parameters<T>[] = [];
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  
  const executeBatch = () => {
    const batch = pendingArgs;
    pendingArgs = [];
    timeoutId = undefined;
    
    batch.forEach(args => func(...args));
  };
  
  return ((...args: Parameters<T>) => {
    pendingArgs.push(args);
    
    if (timeoutId === undefined) {
      timeoutId = setTimeout(executeBatch, delay);
    }
  }) as T;
}