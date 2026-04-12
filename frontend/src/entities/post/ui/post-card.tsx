import { Link } from "react-router-dom";
import type { PostDto } from "../../../shared/api/generated";
import { formatPostDate } from "../lib/post-date";

type PostCardProps = {
  post: PostDto;
};

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-fog bg-white shadow-card">
      {post.coverImageUrl ? (
        <img alt={post.title} className="h-60 w-full object-cover" src={post.coverImageUrl} />
      ) : null}

      <div className="grid gap-4 p-6">
        <p className="text-xs uppercase tracking-[0.25em] text-pine">{formatPostDate(post.publishedAtUtc) ?? "Draft"}</p>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">{post.title}</h3>
          <p className="text-slate-600">{post.excerpt}</p>
        </div>
        <div className="line-clamp-5 whitespace-pre-wrap text-sm leading-7 text-slate-700">{post.contentMarkdown}</div>
        <div>
          <Link className="text-sm font-semibold uppercase tracking-[0.2em] text-clay" to={`/posts/${post.id}`}>
            Read post
          </Link>
        </div>
      </div>
    </article>
  );
}
