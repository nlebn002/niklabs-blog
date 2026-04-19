import { Link, useParams } from "react-router-dom";
import { SiteShell } from "../../components/layout/site-shell";
import { Alert } from "../../components/ui/alert";
import { Panel } from "../../components/ui/panel";
import { usePublicPost } from "../../services/api/posts";
import { formatPostDate } from "../../utils/post-date";

export function PostDetailPage() {
  const { postId = "" } = useParams();
  const postQuery = usePublicPost(postId);

  return (
    <SiteShell contentClassName="max-w-4xl">
      <Link className="text-sm font-semibold uppercase tracking-[0.2em] text-pine" to="/">
        Back to posts
      </Link>

      {postQuery.isLoading ? <Panel>Loading post...</Panel> : null}
      {postQuery.error ? <Alert title="Could not load post" message={postQuery.error.message} /> : null}

      {postQuery.data ? (
        <Panel className="gap-6">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.25em] text-pine">
              {formatPostDate(postQuery.data.publishedAtUtc) ?? "Draft"}
            </p>
            <h1 className="text-4xl font-black leading-tight">{postQuery.data.title}</h1>
            <p className="max-w-3xl text-lg text-muted-foreground">{postQuery.data.excerpt}</p>
          </div>

          {postQuery.data.coverImageUrl ? (
            <img
              src={postQuery.data.coverImageUrl}
              alt={postQuery.data.title}
              className="max-h-[28rem] w-full rounded-[1.5rem] object-cover"
            />
          ) : null}

          <article className="whitespace-pre-wrap text-base leading-8 text-foreground/84">{postQuery.data.contentMarkdown}</article>
        </Panel>
      ) : null}
    </SiteShell>
  );
}
