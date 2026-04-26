import { Link } from "react-router-dom";
import { ArrowRight, Calendar } from "lucide-react";
import type { PostDto } from "../../generated-openapi/models";
import { routes } from "../../router";
import { postStatusLabels } from "../../services/api/posts";
import { formatPostDate } from "../../utils/post-date";

type PostCardProps = {
  post: PostDto;
};

export function PostCard({ post }: PostCardProps) {
  return (
    <Link to={routes.postDetail(post.id)} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card opacity-0 translate-y-6 animate-[fadeUp_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards] transition-[border-color,transform,box-shadow] duration-200 ease-[var(--ease-expo)] hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <div className="relative h-[156px] flex-shrink-0 overflow-hidden bg-muted">
          {post.coverImageUrl ? (
            <img
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-[400ms] group-hover:scale-[1.03]"
              src={post.coverImageUrl}
            />
          ) : (
            <div className="flex h-full w-full items-end bg-[radial-gradient(circle_at_20%_20%,rgba(79,114,255,0.34),transparent_28%),linear-gradient(135deg,#141425,#0e0e16)] p-4">
              <p className="text-2xl font-bold tracking-[-0.03em] text-foreground">Niklabs</p>
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-primary/0 transition-colors duration-300 group-hover:bg-primary/5" />
        </div>

        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <span className="rounded-full border border-[var(--accent-border)] bg-accent px-2 py-0.5 text-[var(--accent-hover)]">
              {postStatusLabels[post.status]}
            </span>
          </div>

          <h3 className="flex-1 text-[15.5px] font-semibold leading-[1.35] tracking-[-0.02em]">{post.title}</h3>
          <p className="line-clamp-2 text-[13px] leading-[1.6] text-muted-foreground">{post.excerpt}</p>

          <div className="flex items-center gap-3 border-t border-border pt-3 text-[12px] text-[var(--text-tertiary)]">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {formatPostDate(post.publishedAtUtc) ?? postStatusLabels[post.status]}
            </span>
            <ArrowRight
              className="ml-auto transition-[transform,color] duration-200 ease-[var(--ease-expo)] group-hover:translate-x-1 group-hover:text-[var(--accent-hover)]"
              size={14}
            />
          </div>
        </div>
      </article>
    </Link>
  );
}
