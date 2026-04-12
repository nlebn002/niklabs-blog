import { cn } from "../lib/cn";

type AlertProps = {
  title: string;
  message: string;
  variant?: "error" | "success";
};

export function Alert({ title, message, variant = "error" }: AlertProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border px-5 py-4",
        variant === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"
      )}
    >
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm">{message}</p>
    </div>
  );
}
