import { Link, useParams } from "react-router-dom";
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
    <SiteShell contentClassName="max-w-5xl">
      <Link
        className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:text-foreground"
        to={routes.home()}
      >
        <span aria-hidden="true">←</span>
        <span>Back to posts</span>
      </Link>

      {postQuery.isLoading ? <Panel className="min-h-[18rem] place-items-center text-muted-foreground">Loading post...</Panel> : null}
      {postQuery.error ? <Alert title="Could not load post" message={postQuery.error.message} /> : null}

      {postQuery.data ? (
        <Panel className="overflow-hidden border-border/80 bg-card/96 p-0">
          <section className="grid gap-8 p-6 lg:p-10">
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-[0.38em] text-primary">
                {formatPostDate(postQuery.data.publishedAtUtc) ?? postQuery.data.status}
              </p>
              <h1 className="font-display max-w-4xl text-5xl leading-[0.95] tracking-[-0.05em] md:text-6xl lg:text-7xl">{postQuery.data.title}</h1>
              <p className="max-w-3xl text-base leading-8 text-muted-foreground md:text-xl">{postQuery.data.excerpt}</p>
            </div>
          </section>

          {postQuery.data.coverImageUrl ? (
            <div className="border-y border-border/80 bg-muted/35 px-4 py-4 lg:px-6">
              <img src={postQuery.data.coverImageUrl} alt={postQuery.data.title} className="max-h-[34rem] w-full rounded-[1.8rem] object-cover" />
            </div>
          ) : null}

          <section className="grid gap-10 px-6 py-8 lg:grid-cols-[0.22fr_0.78fr] lg:px-10 lg:py-10">
            <aside className="space-y-4 text-sm text-muted-foreground">
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-primary">Essay</p>
              <p className="leading-7">The gridline motif stays outside the reading column so the writing remains the focal point.</p>
            </aside>

            <article className="article-prose max-w-none" dangerouslySetInnerHTML={{ __html: postQuery.data.contentHtml }} />
          </section>
        </Panel>
      ) : null}
    </SiteShell>
  );
}
