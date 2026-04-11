export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  contentMarkdown: string;
  coverImageUrl?: string | null;
  isPublished: boolean;
  publishedAtUtc?: string | null;
  createdAtUtc: string;
  updatedAtUtc: string;
};

export type UpsertPostRequest = {
  title: string;
  slug?: string;
  excerpt: string;
  contentMarkdown: string;
  coverImageUrl?: string;
  isPublished: boolean;
};
