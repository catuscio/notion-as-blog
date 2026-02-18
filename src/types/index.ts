export interface TAuthor {
  id: string;
  name: string;
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

export interface TPost {
  id: string;
  title: string;
  slug: string;
  status: "Public" | "PublicOnDetail" | "Draft" | "Private";
  type: "Post" | "Page";
  date: string;
  tags: string[];
  category: string;
  series: string;
  author: string;
  summary: string;
  thumbnail: string;
  fullWidth: boolean;
  pinned: boolean;
}

export interface TTagItem {
  name: string;
  count: number;
}

export interface TCategoryItem {
  name: string;
  count: number;
}
