export function createSingleFlight<T>(load: () => Promise<T>): () => Promise<T> {
  let pending: Promise<T> | null = null;

  return () => {
    if (!pending) {
      pending = load().finally(() => {
        pending = null;
      });
    }
    return pending;
  };
}
