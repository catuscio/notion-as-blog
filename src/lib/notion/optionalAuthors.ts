import type { Author } from "@/types";

type ErrorLogger = (message: string, error: unknown) => void;

export async function loadOptionalAuthors(
  loadAuthors: () => Promise<Author[]>,
  logError: ErrorLogger = console.error,
): Promise<Author[]> {
  try {
    return await loadAuthors();
  } catch (error) {
    logError("[notion/authors] Optional author enrichment unavailable:", error);
    return [];
  }
}
