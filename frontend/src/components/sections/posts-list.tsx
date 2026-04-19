import { PostCard } from "../post/post-card";
import type { PostDto } from "../../generated-openapi/models";

type PostsListProps = {
  posts: PostDto[];
  emptyMessage: string;
};

export function PostsList({ posts, emptyMessage }: PostsListProps) {
  if (posts.length === 0) {
    return <div className="rounded-[1.6rem] border border-border/80 bg-card/90 px-5 py-6 text-muted-foreground shadow-soft">{emptyMessage}</div>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
