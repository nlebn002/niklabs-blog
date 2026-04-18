import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useCurrentUser } from "../api/hooks";

export function RequireAuth() {
  const location = useLocation();
  const currentUserQuery = useCurrentUser();

  if (currentUserQuery.isLoading) {
    return <div className="min-h-screen bg-site px-6 py-8 text-ink">Checking session...</div>;
  }

  if (!currentUserQuery.data) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
