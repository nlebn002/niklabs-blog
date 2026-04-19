import { cn } from "@/utils/cn";

type AlertProps = {
  title: string;
  message: string;
  variant?: "error" | "success";
};

export function Alert({ title, message, variant = "error" }: AlertProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border px-5 py-4 shadow-sm",
        variant === "error"
          ? "border-destructive/20 bg-destructive/10 text-destructive"
          : "border-secondary/20 bg-secondary/10 text-secondary"
      )}
    >
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm text-current/90">{message}</p>
    </div>
  );
}
