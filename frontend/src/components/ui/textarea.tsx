import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea(
  { className, ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[80px] w-full resize-y rounded-md border border-input bg-card px-3.5 py-2.5 text-[14px] text-foreground placeholder:text-[var(--text-tertiary)] transition-[border-color,box-shadow] duration-200 ease-[var(--ease-expo)] focus:outline-none focus:border-[var(--accent-border)] focus:ring-[3px] focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});

export { Textarea };
