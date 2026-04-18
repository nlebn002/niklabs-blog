import { Link } from "react-router-dom";
import type { PostDto } from "../../shared/api/generated/blog/models";
import { formatPostDate } from "../../entities/post/lib/post-date";
import { PostStatusBadge } from "../../entities/post/ui/post-status-badge";
import { buttonStyles } from "../../shared/ui/button";
import { DeletePostButton } from "../../features/post-delete/ui/delete-post-button";

type AdminPostsTableProps = {
  posts: PostDto[];
  isLoading: boolean;
  deletingPostId?: string;
  onDelete: (postId: string) => void;
};

export function AdminPostsTable({ posts, isLoading, deletingPostId, onDelete }: AdminPostsTableProps) {
  if (isLoading) {
    return <div className="rounded-2xl border border-fog bg-white px-5 py-6 text-slate-500">Loading posts...</div>;
  }

  if (posts.length === 0) {
    return <div className="rounded-2xl border border-fog bg-white px-5 py-6 text-slate-500">No posts found.</div>;
  }

  return (
    <div className="grid gap-3">
      {posts.map((post) => (
        <div key={post.id} className="flex flex-col gap-4 rounded-[1.5rem] border border-fog bg-white p-5 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <p className="text-lg font-semibold">{post.title}</p>
              <PostStatusBadge isPublished={post.isPublished} />
            </div>
            <p className="text-sm text-slate-600">{post.excerpt}</p>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              {formatPostDate(post.updatedAtUtc) ? `Updated ${formatPostDate(post.updatedAtUtc)}` : "No update date"}
            </p>
          </div>

          <div className="flex gap-3">
            <Link className={buttonStyles("ghost")} to={`/posts/${post.id}`}>
              Preview
            </Link>
            <Link className={buttonStyles("secondary")} to={`/admin/posts/${post.id}/edit`}>
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
