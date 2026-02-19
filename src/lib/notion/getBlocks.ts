import { notionClient } from "./client";
import { createSemaphore } from "./semaphore";
import type { NotionBlock, NotionBlockWithChildren } from "./types";

const sem = createSemaphore(3);

async function fetchAllBlocks(blockId: string): Promise<NotionBlock[]> {
  const blocks: NotionBlock[] = [];
  let cursor: string | undefined = undefined;

  do {
    const response = await sem.withLimit(() =>
      notionClient.blocks.children.list({
        block_id: blockId,
        start_cursor: cursor,
        page_size: 100,
      })
    );

    for (const block of response.results) {
      if ("type" in block) {
        blocks.push(block as NotionBlock);
      }
    }

    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return blocks;
}

async function fetchChildrenRecursive(
  blocks: NotionBlock[]
): Promise<NotionBlockWithChildren[]> {
  const result: NotionBlockWithChildren[] = [];

  const withChildren = blocks.filter((b) => b.has_children);
  const childrenMap = new Map<string, NotionBlockWithChildren[]>();

  await Promise.all(
    withChildren.map(async (block) => {
      const children = await fetchAllBlocks(block.id);
      const resolved = await fetchChildrenRecursive(children);
      childrenMap.set(block.id, resolved);
    })
  );

  for (const block of blocks) {
    const enriched: NotionBlockWithChildren = {
      ...block,
      children: childrenMap.get(block.id),
    };
    result.push(enriched);
  }

  return result;
}

export async function getPageBlocks(
  pageId: string
): Promise<NotionBlockWithChildren[]> {
  const blocks = await fetchAllBlocks(pageId);
  return fetchChildrenRecursive(blocks);
}
