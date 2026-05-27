export interface Author {
  id: string;
  name: string;
  peopleIds: string[];
  avatar: string;
  bio: string;
  role: string;
  socials: {
    github?: string;
    x?: string;
    linkedin?: string;
    website?: string;
    email?: string;
  };
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  status: "Public" | "PublicOnDetail" | "Draft" | "Private";
  type: "Post" | "Page";
  date: string;
  lastEditedTime: string;
  tags: string[];
  category: string | null;
  series: string | null;
  author: string;
  authorIds: string[];
  summary: string;
  thumbnail: string;
  fullWidth: boolean;
  pinned: boolean;
}

export type AuthorSummary = Pick<Author, "avatar" | "name">;

export interface SelectItemCount {
  name: string;
  count: number;
}

export type TagItem = SelectItemCount;
export type CategoryItem = SelectItemCount;
