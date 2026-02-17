import type {
  BlockObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

export type NotionBlock = BlockObjectResponse;

export type NotionRichText = RichTextItemResponse;

export type NotionBlockWithChildren = NotionBlock & {
  children?: NotionBlockWithChildren[];
};
