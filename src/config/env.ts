/** Environment variable access — centralized to avoid scattering process.env reads. */
export const env = {
  notionDataSourceId: process.env.NOTION_DATA_SOURCE_ID ?? "",
  notionAuthorsDataSourceId: process.env.NOTION_AUTHORS_DATA_SOURCE_ID ?? "",
  gaId: process.env.NEXT_PUBLIC_GA_ID,
  revalidateToken: process.env.TOKEN_FOR_REVALIDATE,
} as const;
