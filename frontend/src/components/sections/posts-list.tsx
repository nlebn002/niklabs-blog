import { PostCard } from "../post/post-card";
import type { PostDto } from "../../generated-openapi/models";

type PostsListProps = {
  posts: PostDto[];
  emptyMessage: string;
};

export function PostsList({ posts, emptyMessage }: PostsListProps) {
  if (posts.length === 0) {
    return <div className="rounded-lg border border-border bg-card px-5 py-12 text-center text-[13px] text-[var(--text-tertiary)]">{emptyMessage}</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
