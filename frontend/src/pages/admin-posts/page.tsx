import { Link } from "react-router-dom";
import { useAdminPosts, useDeletePost } from "../../shared/api/hooks/posts";
import { Alert } from "../../shared/ui/alert";
import { buttonStyles } from "../../shared/ui/button";
import { Panel } from "../../shared/ui/panel";
import { AdminPostsTable } from "../../widgets/admin-posts-table/ui";
import { SiteHeader } from "../../widgets/site-header/ui";
import { LogoutButton } from "../../features/auth/ui/logout-button";

export function AdminPostsPage() {
  const postsQuery = useAdminPosts();
  const deleteMutation = useDeletePost();

  return (
    <div className="min-h-screen bg-site text-ink">
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 py-8 lg:px-10">
        <SiteHeader
          eyebrow="Admin"
          title="Manage posts without mixing admin flows into the public homepage."
          description="Generated API contracts, route-based screens, and isolated post management actions."
          ctaLabel="Create post"
          ctaTo="/admin/posts/new"
        />

        {postsQuery.error ? <Alert title="Could not load admin posts" message={postsQuery.error.message} /> : null}
        {deleteMutation.error ? <Alert title="Delete failed" message={deleteMutation.error.message} /> : null}

        <Panel className="gap-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-clay">Admin posts</p>
              <h2 className="mt-2 text-2xl font-bold">All content</h2>
            </div>

            <div className="flex gap-3">
              <LogoutButton />
              <Link className={buttonStyles("ghost")} to="/">
                Public view
              </Link>
              <Link className={buttonStyles()} to="/admin/posts/new">
                New post
              </Link>
            </div>
          </div>

          <AdminPostsTable
            posts={postsQuery.data ?? []}
            isLoading={postsQuery.isLoading}
            onDelete={(postId) => deleteMutation.mutate(postId)}
            deletingPostId={deleteMutation.variables}
          />
        </Panel>
      </main>
    </div>
  );
}
