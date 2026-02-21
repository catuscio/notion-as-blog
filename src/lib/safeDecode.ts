/** Safely decode a URI component, returning the original value if decoding fails. */
export function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
