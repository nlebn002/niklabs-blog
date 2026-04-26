import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar } from "lucide-react";
import { SiteShell } from "../../components/layout/site-shell";
import { Alert } from "../../components/ui/alert";
import { Panel } from "../../components/ui/panel";
import { routes } from "../../router";
import { usePublicPost } from "../../services/api/posts";
import { formatPostDate } from "../../utils/post-date";

export function PostDetailPage() {
  const { postId = "" } = useParams();
  const postQuery = usePublicPost(postId);

  return (
    <SiteShell contentClassName="max-w-[1200px] gap-0 px-[clamp(1rem,4vw,2rem)] pb-24 pt-16">
      <Link
        className="mb-8 inline-flex items-center gap-1.5 text-[13px] text-[var(--text-tertiary)] transition-colors hover:text-muted-foreground"
        to={routes.home()}
      >
        <ArrowLeft size={13} />
        <span>All articles</span>
      </Link>

      {postQuery.isLoading ? <Panel className="min-h-[18rem] place-items-center text-muted-foreground">Loading post...</Panel> : null}
      {postQuery.error ? <Alert title="Could not load post" message={postQuery.error.message} /> : null}

      {postQuery.data ? (
        <article className="mx-auto w-full max-w-[68ch]">
          <header className="mb-12">
            <div className="mb-4 flex flex-wrap gap-1.5">
              <span className="rounded-full border border-[var(--accent-border)] bg-accent px-2.5 py-0.5 text-[12px] text-[var(--accent-hover)]">
                {postQuery.data.status}
              </span>
            </div>
            <h1 className="mb-5 text-[clamp(36px,5vw,56px)] font-bold leading-[1.1] tracking-[-0.03em] text-foreground">
              {postQuery.data.title}
            </h1>
            <p className="mb-6 font-serif text-[17px] leading-[1.6] text-muted-foreground">{postQuery.data.excerpt}</p>
            <div className="flex items-center gap-5 text-[13px] text-[var(--text-tertiary)]">
              <span className="flex items-center gap-1.5">
                <Calendar size={13} />
                {formatPostDate(postQuery.data.publishedAtUtc) ?? postQuery.data.status}
              </span>
              <span className="text-muted-foreground">Nikita</span>
            </div>
          </header>

          {postQuery.data.coverImageUrl ? (
            <div className="mb-10 border-y border-border py-4">
              <img
                src={postQuery.data.coverImageUrl}
                alt={postQuery.data.title}
                className="max-h-[34rem] w-full rounded-[11px] border border-border object-cover"
              />
            </div>
          ) : null}

          <div className="mb-10 border-t border-border pt-10" />

          <div className="article-prose max-w-none" dangerouslySetInnerHTML={{ __html: postQuery.data.contentHtml }} />

          <div className="mt-16 border-t border-border pt-8">
            <div className="mb-3 text-[11px] uppercase tracking-[0.06em] text-[var(--text-tertiary)]">Tagged</div>
            <div className="flex flex-wrap gap-1.5">
              <span className="rounded-full border border-border bg-card px-2.5 py-0.5 text-[12px] text-muted-foreground">
                {postQuery.data.status}
              </span>
            </div>
          </div>
        </article>
      ) : null}
    </SiteShell>
  );
}
