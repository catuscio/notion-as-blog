/** Maps a Notion color string to a CSS class. Returns undefined for "default". */
export function notionColorClass(color: string): string | undefined {
  if (color === "default") return undefined;
  return color.endsWith("_background")
    ? `notion-bg-${color.replace("_background", "")}`
    : `notion-color-${color}`;
}
