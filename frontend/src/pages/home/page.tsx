import { SiteShell } from "../../components/layout/site-shell";
import { PostsList } from "../../components/sections/posts-list";
import { Alert } from "../../components/ui/alert";
import { Panel } from "../../components/ui/panel";
import { usePublishedPosts } from "../../services/api/posts";

export function HomePage() {
  const postsQuery = usePublishedPosts();

  return (
    <SiteShell contentClassName="max-w-none">
      {postsQuery.error ? <Alert title="Could not load published posts" message={postsQuery.error.message} /> : null}

      {postsQuery.isLoading ? <Panel className="min-h-[16rem] place-items-center text-muted-foreground">Loading published posts...</Panel> : null}

      <section className="grid w-full gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <Panel className="content-start gap-5 border-border bg-card/95 p-5 shadow-none">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Search</p>
            <div className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
              Search articles
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Filters</p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-border bg-background px-3 py-2 text-sm text-muted-foreground">All topics</span>
              <span className="rounded-full border border-border bg-background px-3 py-2 text-sm text-muted-foreground">Backend</span>
              <span className="rounded-full border border-border bg-background px-3 py-2 text-sm text-muted-foreground">Architecture</span>
              <span className="rounded-full border border-border bg-background px-3 py-2 text-sm text-muted-foreground">Career</span>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Sort</p>
            <div className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
              Newest first
            </div>
          </div>
        </Panel>

        <section className="space-y-5">
          <PostsList posts={postsQuery.data ?? []} emptyMessage="No published posts yet." />
        </section>
      </section>
    </SiteShell>
  );
}
