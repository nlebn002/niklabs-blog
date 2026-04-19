import { SiteShell } from "../../components/layout/site-shell";
import { Alert } from "../../components/ui/alert";
import { usePublishedPosts } from "../../services/api/posts";

export function HomePage() {
  const postsQuery = usePublishedPosts();

  return (
    <SiteShell contentClassName="max-w-6xl">
      {postsQuery.error ? (
        <Alert
          title="Could not load published posts"
          message={postsQuery.error.message}
        />
      ) : null}
    </SiteShell>
  );
}
