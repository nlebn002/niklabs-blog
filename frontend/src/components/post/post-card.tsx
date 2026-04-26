import { Link } from "react-router-dom";
import type { PostDto } from "../../generated-openapi/models";
import { routes } from "../../router";
import { postStatusLabels } from "../../services/api/posts";
import { formatPostDate } from "../../utils/post-date";

type PostCardProps = {
  post: PostDto;
};

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-border bg-card transition-colors hover:border-primary/40">
      <div className="border-b border-border bg-muted/40">
        {post.coverImageUrl ? (
          <img alt={post.title} className="h-56 w-full object-cover" src={post.coverImageUrl} />
        ) : (
          <div className="flex min-h-[14rem] items-end bg-gradient-to-br from-accent via-card to-muted p-5">
            <p className="font-display text-2xl leading-tight tracking-[-0.03em]">Niklabs</p>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          <span>{formatPostDate(post.publishedAtUtc) ?? postStatusLabels[post.status]}</span>
          <span>{postStatusLabels[post.status]}</span>
        </div>

        <div className="space-y-3">
          <h3 className="font-display text-[1.75rem] leading-tight tracking-[-0.03em]">{post.title}</h3>
          <p className="line-clamp-3 text-sm leading-7 text-muted-foreground">{post.excerpt}</p>
        </div>

        <div className="line-clamp-3 text-sm leading-7 text-foreground/72">{post.contentText}</div>

        <div className="mt-auto pt-2">
          <Link
            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors group-hover:text-primary"
            to={routes.postDetail(post.id)}
          >
            Read more
            <span aria-hidden="true">&gt;</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
