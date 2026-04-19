import { Navigate, Route, Routes } from "react-router-dom";
import { RequireAuth } from "./features/auth/model/require-auth";
import { ChangePasswordPage } from "./pages/change-password/page";
import { HomePage } from "./pages/home/page";
import { PostDetailPage } from "./pages/post-detail/page";
import { PostEditorPage } from "./pages/post-editor/page";
import { LoginPage } from "./pages/sign-in/page";

const postIdParam = ":postId";

export const routes = {
  home: () => "/",
  login: () => "/login",
  myPosts: () => "/my-posts",
  changePassword: () => "/account/change-password",
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
        <Route path={routes.myPosts()} element={<HomePage />} />
        <Route path={routes.changePassword()} element={<ChangePasswordPage />} />
        <Route path={routes.postCreate()} element={<PostEditorPage />} />
        <Route path={routes.postEdit()} element={<PostEditorPage />} />
      </Route>
      <Route path="*" element={<Navigate to={routes.home()} replace />} />
    </Routes>
  );
}
