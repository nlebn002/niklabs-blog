import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Alert } from "../../../components/ui/alert";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z
      .string()
      .min(12, "New password must be at least 12 characters.")
      .regex(/[a-z]/, "New password must include a lowercase letter.")
      .regex(/[A-Z]/, "New password must include an uppercase letter.")
      .regex(/[0-9]/, "New password must include a number."),
    confirmPassword: z.string().min(1, "Please confirm the new password.")
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Confirmation must match the new password.",
    path: ["confirmPassword"]
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

type ChangePasswordFormProps = {
  isSubmitting: boolean;
  errorMessage?: string;
  successMessage?: string;
  onSubmit: (values: ChangePasswordFormValues) => Promise<void>;
};

export function ChangePasswordForm({
  isSubmitting,
  errorMessage,
  successMessage,
  onSubmit
}: ChangePasswordFormProps) {
  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  });

  return (
    <form
      className="grid gap-5"
      onSubmit={form.handleSubmit(async (values) => {
        await onSubmit(values);
        form.reset();
      })}
    >
      {errorMessage ? <Alert title="Could not change password" message={errorMessage} /> : null}
      {successMessage ? <Alert title="Password updated" message={successMessage} variant="success" /> : null}

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-semibold text-foreground" htmlFor="currentPassword">
            Current password
          </label>
          <Input id="currentPassword" type="password" autoComplete="current-password" {...form.register("currentPassword")} />
          {form.formState.errors.currentPassword ? (
            <p className="text-sm text-destructive">{form.formState.errors.currentPassword.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground" htmlFor="newPassword">
            New password
          </label>
          <Input id="newPassword" type="password" autoComplete="new-password" {...form.register("newPassword")} />
          {form.formState.errors.newPassword ? (
            <p className="text-sm text-destructive">{form.formState.errors.newPassword.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground" htmlFor="confirmPassword">
            Confirm new password
          </label>
          <Input id="confirmPassword" type="password" autoComplete="new-password" {...form.register("confirmPassword")} />
          {form.formState.errors.confirmPassword ? (
            <p className="text-sm text-destructive">{form.formState.errors.confirmPassword.message}</p>
          ) : null}
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating password..." : "Change password"}
        </Button>
      </div>
    </form>
  );
}
