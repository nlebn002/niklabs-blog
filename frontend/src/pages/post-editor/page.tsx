import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
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
    <SiteShell contentClassName="max-w-[900px]">
      <div className="flex items-center justify-between gap-4">
        <Link
          className="inline-flex items-center gap-1.5 text-[13px] text-[var(--text-tertiary)] transition-colors hover:text-muted-foreground"
          to={routes.home()}
        >
          <ArrowLeft size={13} />
          All articles
        </Link>
        <LogoutButton />
      </div>

      <Panel className="gap-6">
        <div>
          <p className="text-[12px] tracking-[0.04em] text-[var(--text-tertiary)]">{isEditMode ? "Edit post" : "Create post"}</p>
          <h1 className="mt-2 text-[28px] font-bold leading-[1.2] tracking-[-0.025em]">{isEditMode ? "Update existing article" : "Draft a new article"}</h1>
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
