import { Link, useNavigate, useParams } from "react-router-dom";
import { SiteShell } from "../../components/layout/site-shell";
import { Alert } from "../../components/ui/alert";
import { Panel } from "../../components/ui/panel";
import { LogoutButton } from "../../features/auth/ui/logout-button";
import { PostForm } from "../../features/post-editor/ui/post-form";
import { routes } from "../../router";
import { useEditablePost, useCreatePost, useUpdatePost } from "../../services/api/posts";

export function PostEditorPage() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const isEditMode = Boolean(postId);

  const postQuery = useEditablePost(postId ?? "");
  const createMutation = useCreatePost();
  const updateMutation = useUpdatePost(postId ?? "");

  const currentPost = postQuery.data;
  const activeError = postQuery.error ?? createMutation.error ?? updateMutation.error;

  return (
    <SiteShell contentClassName="max-w-4xl">
      <div className="flex items-center justify-between gap-4">
        <Link
          className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:text-foreground"
          to={routes.home()}
        >
          <span aria-hidden="true">&lt;</span>
          Back to site
        </Link>
        <LogoutButton />
      </div>

      <Panel className="gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-primary">{isEditMode ? "Edit post" : "Create post"}</p>
          <h1 className="mt-2 text-3xl font-black">{isEditMode ? "Update existing post" : "Draft a new post"}</h1>
        </div>

        {activeError ? <Alert title="Action failed" message={activeError.message} /> : null}

        {isEditMode && postQuery.isLoading ? <div>Loading post...</div> : null}

        {!isEditMode || currentPost ? (
          <PostForm
            initialValues={
              currentPost
                ? {
                    title: currentPost.title,
                    slug: currentPost.slug,
                    excerpt: currentPost.excerpt,
                    contentJson: currentPost.contentJson,
                    coverImageMediaAssetId: currentPost.coverImageMediaAssetId,
                    coverImageUrl: currentPost.coverImageUrl,
                    status: currentPost.status,
                    seoTitle: currentPost.seoTitle,
                    seoDescription: currentPost.seoDescription
                  }
                : undefined
            }
            isSubmitting={createMutation.isPending || updateMutation.isPending}
            submitLabel={isEditMode ? "Update post" : "Create post"}
            onSubmit={async (values) => {
              if (isEditMode && postId) {
                await updateMutation.mutateAsync(values);
              } else {
                await createMutation.mutateAsync(values);
              }

              navigate(routes.home());
            }}
          />
        ) : null}
      </Panel>
    </SiteShell>
  );
}
