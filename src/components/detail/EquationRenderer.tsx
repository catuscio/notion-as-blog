import katex from "katex";

function renderKatex(expression: string, displayMode: boolean): string {
  try {
    return katex.renderToString(expression, {
      displayMode,
      throwOnError: false,
      output: "htmlAndMathml",
    });
  } catch {
    return expression;
  }
}

export function EquationBlock({ expression }: { expression: string }) {
  const html = renderKatex(expression, true);
  return (
    <div
      className="my-6 overflow-x-auto text-center"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function InlineEquation({ expression }: { expression: string }) {
  const html = renderKatex(expression, false);
  return (
    <span
      className="inline-block align-middle"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
