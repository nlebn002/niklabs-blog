import { Link } from "react-router-dom";
import { SiteShell } from "../../components/layout/site-shell";
import { AdminPostsTable } from "../../components/sections/admin-posts-table";
import { SiteHeader } from "../../components/sections/site-header";
import { Alert } from "../../components/ui/alert";
import { buttonStyles } from "../../components/ui/button";
import { Panel } from "../../components/ui/panel";
import { LogoutButton } from "../../features/auth/ui/logout-button";
import { routes } from "../../router";
import { useAdminPosts, useDeletePost } from "../../services/api/posts";

export function AdminPostsPage() {
  const postsQuery = useAdminPosts();
  const deleteMutation = useDeletePost();

  return (
    <SiteShell contentClassName="max-w-6xl">
      <SiteHeader
        eyebrow="Admin"
        title="Manage posts without mixing admin flows into the public homepage."
        description="Generated API contracts, route-based screens, and isolated post management actions."
        ctaLabel="Create post"
        ctaTo={routes.postCreate()}
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
            <Link className={buttonStyles("ghost")} to={routes.home()}>
              Public view
            </Link>
            <Link className={buttonStyles()} to={routes.postCreate()}>
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
    </SiteShell>
  );
}
