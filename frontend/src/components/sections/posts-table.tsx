import { Link } from "react-router-dom";
import { PostStatusBadge } from "../post/post-status-badge";
import { buttonStyles } from "../ui/button";
import { DeletePostButton } from "../../features/post-delete/ui/delete-post-button";
import type { PostDto } from "../../generated-openapi/models";
import { routes } from "../../router";
import { formatPostDate } from "../../utils/post-date";

type PostsTableProps = {
  posts: PostDto[];
  isLoading: boolean;
  deletingPostId?: string;
  onDelete: (postId: string) => void;
};

export function PostsTable({ posts, isLoading, deletingPostId, onDelete }: PostsTableProps) {
  if (isLoading) {
    return <div className="rounded-3xl border border-border bg-card px-5 py-6 text-muted-foreground">Loading posts...</div>;
  }

  if (posts.length === 0) {
    return <div className="rounded-3xl border border-border bg-card px-5 py-6 text-muted-foreground">No posts found.</div>;
  }

  return (
    <div className="grid gap-3">
      {posts.map((post) => (
        <div
          key={post.id}
          className="flex flex-col gap-4 rounded-[1.5rem] border border-border/80 bg-background/85 p-5 shadow-sm md:flex-row md:items-center md:justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <p className="text-lg font-semibold">{post.title}</p>
              <PostStatusBadge status={post.status} />
            </div>
            <p className="text-sm text-muted-foreground">{post.excerpt}</p>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {formatPostDate(post.updatedAtUtc) ? `Updated ${formatPostDate(post.updatedAtUtc)}` : "No update date"}
            </p>
          </div>

          <div className="flex gap-3">
            <Link className={buttonStyles("ghost")} to={routes.postDetail(post.id)}>
              Preview
            </Link>
            <Link className={buttonStyles("secondary")} to={routes.postEdit(post.id)}>
              Edit
            </Link>
            <DeletePostButton
              disabled={deletingPostId === post.id}
              onClick={() => onDelete(post.id)}
              label={deletingPostId === post.id ? "Deleting..." : "Delete"}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
