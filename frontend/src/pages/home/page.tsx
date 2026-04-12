import { usePublishedPosts } from "../../shared/api/hooks/posts";
import { Alert } from "../../shared/ui/alert";
import { Panel } from "../../shared/ui/panel";
import { PostsList } from "../../widgets/posts-list/ui";
import { SiteHeader } from "../../widgets/site-header/ui";

export function HomePage() {
  const postsQuery = usePublishedPosts();

  return (
    <div className="min-h-screen bg-site text-ink">
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 py-8 lg:px-10">
        <SiteHeader
          eyebrow="niklabs.cloud"
          title="Shipping notes, experiments, and lessons from the lab."
          description="A lightweight React frontend driven by generated contracts from the .NET API."
          ctaLabel="Open admin"
          ctaTo="/admin/posts"
        />

        {postsQuery.error ? <Alert title="Could not load published posts" message={postsQuery.error.message} /> : null}

        <Panel className="gap-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-clay">Published posts</p>
              <h2 className="mt-2 text-2xl font-bold">Latest writing</h2>
            </div>
          </div>

          <PostsList
            posts={postsQuery.data ?? []}
            emptyMessage={postsQuery.isLoading ? "Loading published posts..." : "No published posts yet."}
          />
        </Panel>
      </main>
    </div>
  );
}
