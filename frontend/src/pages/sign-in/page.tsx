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
      navigate(routes.home(), { replace: true });
    }
  }, [currentUserQuery.data, navigate]);

  const destination = (location.state as LocationState | null)?.from?.pathname ?? routes.home();

  return (
    <SiteShell contentClassName="max-w-xl justify-center">
      <Link
        className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:text-foreground"
        to={routes.home()}
      >
        <span aria-hidden="true">&lt;</span>
        Home
      </Link>

      <Panel className="gap-5">
        <div className="space-y-3">
          <h1 className="text-3xl font-black">Sign in</h1>
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
