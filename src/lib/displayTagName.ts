const leadingSymbolPattern = /^[\p{Extended_Pictographic}\uFE0F\u200D]+\s*/u;

export function displayTagName(tag: string) {
  const label = tag.replace(leadingSymbolPattern, "").trim();
  return label || tag;
}
