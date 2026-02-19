import type { NotionBlockWithChildren } from "@/lib/notion/types";

export type GroupedItem =
  | { kind: "block"; block: NotionBlockWithChildren }
  | {
      kind: "list";
      listType: "bulleted_list_item" | "numbered_list_item";
      items: NotionBlockWithChildren[];
    };

export function groupListItems(blocks: NotionBlockWithChildren[]): GroupedItem[] {
  const groups: GroupedItem[] = [];

  for (const block of blocks) {
    const type = block.type;
    if (type === "bulleted_list_item" || type === "numbered_list_item") {
      const last = groups[groups.length - 1];
      if (last && last.kind === "list" && last.listType === type) {
        last.items.push(block);
      } else {
        groups.push({ kind: "list", listType: type, items: [block] });
      }
    } else {
      groups.push({ kind: "block", block });
    }
  }

  return groups;
}
