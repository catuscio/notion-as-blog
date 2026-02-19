export function createSemaphore(concurrency: number) {
  let running = 0;
  const queue: (() => void)[] = [];

  function next() {
    if (queue.length > 0 && running < concurrency) {
      running++;
      const resolve = queue.shift()!;
      resolve();
    }
  }

  async function withLimit<T>(fn: () => Promise<T>): Promise<T> {
    await new Promise<void>((resolve) => {
      queue.push(resolve);
      next();
    });
    try {
      return await fn();
    } finally {
      running--;
      next();
    }
  }

  return { withLimit };
}
