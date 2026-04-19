import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

const loginSchema = z.object({
  userNameOrEmail: z.string().trim().min(1, "Username or email is required."),
  password: z.string().min(1, "Password is required."),
  rememberMe: z.boolean()
});

export type LoginFormValues = z.infer<typeof loginSchema>;

type LoginFormProps = {
  isSubmitting: boolean;
  onSubmit: (values: LoginFormValues) => Promise<void>;
};

export function LoginForm({ isSubmitting, onSubmit }: LoginFormProps) {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userNameOrEmail: "",
      password: "",
      rememberMe: false
    }
  });

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={form.handleSubmit(async (values) => {
        await onSubmit(values);
      })}
    >
      <div className="space-y-2">
        <label className="text-sm font-semibold uppercase tracking-[0.2em] text-clay" htmlFor="userNameOrEmail">
          Username or email
        </label>
        <Input id="userNameOrEmail" {...form.register("userNameOrEmail")} />
        {form.formState.errors.userNameOrEmail ? (
          <p className="text-sm text-rose-700">{form.formState.errors.userNameOrEmail.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold uppercase tracking-[0.2em] text-clay" htmlFor="password">
          Password
        </label>
        <Input id="password" type="password" {...form.register("password")} />
        {form.formState.errors.password ? (
          <p className="text-sm text-rose-700">{form.formState.errors.password.message}</p>
        ) : null}
      </div>

      <label className="flex items-center gap-3 text-sm text-slate-700">
        <input type="checkbox" {...form.register("rememberMe")} />
        Remember this browser
      </label>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
