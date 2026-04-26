import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { SiteShell } from "../../components/layout/site-shell";
import { Alert } from "../../components/ui/alert";
import { Panel } from "../../components/ui/panel";
import { useChangePassword } from "../../features/auth/api/hooks";
import { ChangePasswordForm } from "../../features/auth/ui/change-password-form";
import { routes } from "../../router";

export function ChangePasswordPage() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const changePasswordMutation = useChangePassword();

  return (
    <SiteShell contentClassName="max-w-3xl">
      <Link
        className="inline-flex items-center gap-1.5 text-[13px] text-[var(--text-tertiary)] transition-colors hover:text-muted-foreground"
        to={routes.home()}
      >
        <ArrowLeft size={13} />
        <span>All articles</span>
      </Link>

      <Panel className="gap-6">
        <div className="space-y-3">
          <p className="text-[12px] tracking-[0.04em] text-[var(--text-tertiary)]">Account</p>
          <h1 className="font-display text-[28px] font-bold leading-[1.2] tracking-[-0.025em]">Change password</h1>
        </div>

        {changePasswordMutation.error ? (
          <Alert title="Password update failed" message={changePasswordMutation.error.message} />
        ) : null}

        <ChangePasswordForm
          isSubmitting={changePasswordMutation.isPending}
          errorMessage={undefined}
          successMessage={successMessage ?? undefined}
          onSubmit={async (values) => {
            setSuccessMessage(null);
            await changePasswordMutation.mutateAsync({
              currentPassword: values.currentPassword,
              newPassword: values.newPassword
            });
            setSuccessMessage("Your password was updated successfully.");
          }}
        />
      </Panel>
    </SiteShell>
  );
}
