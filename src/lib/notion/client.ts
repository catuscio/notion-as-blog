import { Client } from "@notionhq/client";

const apiKey = process.env.NOTION_API_KEY;
if (!apiKey) {
  throw new Error("NOTION_API_KEY environment variable is required");
}

export const notionClient = new Client({ auth: apiKey });
