import katex from "katex";

/** Render content-derived equations, including a text-only fallback on parser failure. */
export function renderEquationHtml(expression: string, displayMode: boolean): string {
  try {
    return katex.renderToString(expression, {
      displayMode,
      throwOnError: false,
      output: "htmlAndMathml",
    });
  } catch {
    return expression.replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[character]!);
  }
}
