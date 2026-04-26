import { SiteShell } from "../../components/layout/site-shell";
import { PostsList } from "../../components/sections/posts-list";
import { Alert } from "../../components/ui/alert";
import { Panel } from "../../components/ui/panel";
import { usePublishedPosts } from "../../services/api/posts";

export function HomePage() {
  const postsQuery = usePublishedPosts();
  const chipBaseClass =
    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[13px] transition-all duration-150 ease-[var(--ease-expo)]";

  return (
    <SiteShell contentClassName="max-w-[1200px] gap-0 px-[clamp(1rem,4vw,2rem)] py-0">
      {postsQuery.error ? <Alert title="Could not load published posts" message={postsQuery.error.message} /> : null}

      {postsQuery.isLoading ? <Panel className="min-h-[16rem] place-items-center text-muted-foreground">Loading published posts...</Panel> : null}

      <section className="grid w-full gap-7 pb-24">
        <Panel className="content-start gap-5 border-border bg-card p-4 shadow-none">
          <div className="space-y-2">
            <div className="text-[12px] tracking-[0.04em] text-[var(--text-tertiary)]">Search</div>
            <div className="rounded-lg border border-white/15 bg-card px-4 py-3 text-sm text-[var(--text-tertiary)]">
              Search articles
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[12px] tracking-[0.04em] text-[var(--text-tertiary)]">Browse by tag</p>
            <div className="flex flex-wrap gap-2">
              <span className={`${chipBaseClass} border-primary bg-primary text-white`}>All topics</span>
              <span className={`${chipBaseClass} border-border bg-card text-muted-foreground`}>Backend</span>
              <span className={`${chipBaseClass} border-border bg-card text-muted-foreground`}>Architecture</span>
              <span className={`${chipBaseClass} border-border bg-card text-muted-foreground`}>Career</span>
            </div>
          </div>

        </Panel>

        <section className="space-y-5">
          <div className="text-[13px] text-[var(--text-tertiary)]">{postsQuery.data?.length ?? 0} articles</div>
          <PostsList posts={postsQuery.data ?? []} emptyMessage="No published posts yet." />
        </section>
      </section>
    </SiteShell>
  );
}
