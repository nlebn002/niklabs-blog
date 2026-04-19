import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SiteShell } from "../../components/layout/site-shell";
import { useCurrentUser, useLogin } from "../../features/auth/api/hooks";
import { LoginForm } from "../../features/auth/ui/login-form";
import { Alert } from "../../components/ui/alert";
import { Panel } from "../../components/ui/panel";
import { routes } from "../../router";

type LocationState = {
  from?: {
    pathname?: string;
  };
};

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUserQuery = useCurrentUser();
  const loginMutation = useLogin();

  useEffect(() => {
    if (currentUserQuery.data) {
      navigate(routes.posts(), { replace: true });
    }
  }, [currentUserQuery.data, navigate]);

  const destination = (location.state as LocationState | null)?.from?.pathname ?? routes.posts();

  return (
    <SiteShell contentClassName="max-w-xl justify-center">
      <Link className="text-sm font-semibold uppercase tracking-[0.2em] text-pine" to={routes.home()}>
        Back to public site
      </Link>

      <Panel className="gap-5">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.24em] text-clay">Admin access</p>
          <h1 className="text-3xl font-black">Sign in to manage posts</h1>
          <p className="text-muted-foreground">This session uses secure server-managed cookies with CSRF protection.</p>
        </div>

        {loginMutation.error ? <Alert title="Could not sign in" message={loginMutation.error.message} /> : null}

        <LoginForm
          isSubmitting={loginMutation.isPending}
          onSubmit={async (values) => {
            await loginMutation.mutateAsync(values);
            navigate(destination, { replace: true });
          }}
        />
      </Panel>
    </SiteShell>
  );
}
