import { renderEquationHtml } from "@/lib/security/equation";

export function EquationBlock({ expression }: { expression: string }) {
  const html = renderEquationHtml(expression, true);
  return (
    <div
      className="my-6 overflow-x-auto text-center"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function InlineEquation({ expression }: { expression: string }) {
  const html = renderEquationHtml(expression, false);
  return (
    <span
      className="inline-block align-middle"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
