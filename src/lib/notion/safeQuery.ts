export async function safeQuery<T>(
  fn: () => Promise<T>,
  fallback: T,
  label?: string
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.error(`[safeQuery${label ? `:${label}` : ""}] Failed, returning fallback:`, error);
    return fallback;
  }
}
