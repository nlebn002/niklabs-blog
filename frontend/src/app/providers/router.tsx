import { Navigate, Route, Routes } from "react-router-dom";
import { RequireAuth } from "../../features/auth/model/require-auth";
import { AdminLoginPage } from "../../pages/admin-login/page";
import { AdminPostsEditorPage } from "../../pages/admin-post-editor/page";
import { AdminPostsPage } from "../../pages/admin-posts/page";
import { HomePage } from "../../pages/home/page";
import { PostDetailPage } from "../../pages/post-detail/page";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/posts/:postId" element={<PostDetailPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route element={<RequireAuth />}>
        <Route path="/admin/posts" element={<AdminPostsPage />} />
        <Route path="/admin/posts/new" element={<AdminPostsEditorPage />} />
        <Route path="/admin/posts/:postId/edit" element={<AdminPostsEditorPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
