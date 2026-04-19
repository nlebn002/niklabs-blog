import { Navigate, Route, Routes } from "react-router-dom";
import { RequireAuth } from "./features/auth/model/require-auth";
import { LoginPage } from "./pages/admin-login/page";
import { PostsEditorPage } from "./pages/admin-post-editor/page";
import { PostsPage } from "./pages/admin-posts/page";
import { HomePage } from "./pages/home/page";
import { PostDetailPage } from "./pages/post-detail/page";

const postIdParam = ":postId";

export const routes = {
  home: () => "/",
  login: () => "/login",
  posts: () => "/posts",
  postCreate: () => "/posts/new",
  postDetail: (postId: string = postIdParam) => `/posts/${postId}`,
  postEdit: (postId: string = postIdParam) => `/posts/${postId}/edit`
} as const;

export function AppRouter() {
  return (
    <Routes>
      <Route path={routes.home()} element={<HomePage />} />
      <Route path={routes.postDetail()} element={<PostDetailPage />} />
      <Route path={routes.login()} element={<LoginPage />} />
      <Route element={<RequireAuth />}>
        <Route path={routes.posts()} element={<PostsPage />} />
        <Route path={routes.postCreate()} element={<PostsEditorPage />} />
        <Route path={routes.postEdit()} element={<PostsEditorPage />} />
      </Route>
      <Route path="*" element={<Navigate to={routes.home()} replace />} />
    </Routes>
  );
}
