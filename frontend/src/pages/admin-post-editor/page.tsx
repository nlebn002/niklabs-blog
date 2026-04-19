import { Link, useNavigate, useParams } from "react-router-dom";
import { SiteShell } from "../../components/layout/site-shell";
import { Alert } from "../../components/ui/alert";
import { Panel } from "../../components/ui/panel";
import { LogoutButton } from "../../features/auth/ui/logout-button";
import { PostForm } from "../../features/post-editor/ui/post-form";
import { useAdminPost, useCreatePost, useUpdatePost } from "../../services/api/posts";

export function AdminPostsEditorPage() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const isEditMode = Boolean(postId);

  const postQuery = useAdminPost(postId ?? "");
  const createMutation = useCreatePost();
  const updateMutation = useUpdatePost(postId ?? "");

  const currentPost = postQuery.data;
  const activeError = postQuery.error ?? createMutation.error ?? updateMutation.error;

  return (
    <SiteShell contentClassName="max-w-4xl">
      <div className="flex items-center justify-between gap-4">
        <Link className="text-sm font-semibold uppercase tracking-[0.2em] text-pine" to="/admin/posts">
          Back to admin posts
        </Link>
        <LogoutButton />
      </div>

      <Panel className="gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-clay">{isEditMode ? "Edit post" : "Create post"}</p>
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
                    excerpt: currentPost.excerpt,
                    contentMarkdown: currentPost.contentMarkdown,
                    coverImageUrl: currentPost.coverImageUrl,
                    isPublished: currentPost.isPublished
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

              navigate("/admin/posts");
            }}
          />
        ) : null}
      </Panel>
    </SiteShell>
  );
}
