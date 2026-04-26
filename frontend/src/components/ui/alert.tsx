import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

const alertVariants = cva("relative w-full rounded-lg border px-5 py-4 shadow-sm", {
  variants: {
    variant: {
      error: "border-destructive/20 bg-destructive/10 text-destructive",
      success: "border-primary/20 bg-primary/10 text-primary"
    }
  },
  defaultVariants: {
    variant: "error"
  }
});

type AlertProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof alertVariants> & {
    title: string;
    message: string;
  };

function Alert({ className, title, message, variant = "error", ...props }: AlertProps) {
  return (
    <div className={cn(alertVariants({ variant }), className)} role={variant === "error" ? "alert" : "status"} {...props}>
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm text-current/90">{message}</p>
    </div>
  );
}

export { Alert, alertVariants };
