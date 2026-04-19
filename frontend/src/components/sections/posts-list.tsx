import { PostCard } from "../post/post-card";
import type { PostDto } from "../../generated-openapi/models";

type PostsListProps = {
  posts: PostDto[];
  emptyMessage: string;
};

export function PostsList({ posts, emptyMessage }: PostsListProps) {
  if (posts.length === 0) {
    return <div className="rounded-2xl border border-fog bg-white px-5 py-6 text-slate-500">{emptyMessage}</div>;
  }

  return (
    <div className="grid gap-5">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
