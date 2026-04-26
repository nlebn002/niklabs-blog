import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-card px-3.5 text-[14px] text-foreground placeholder:text-[var(--text-tertiary)] transition-[border-color,box-shadow] duration-200 ease-[var(--ease-expo)] focus:outline-none focus:border-[var(--accent-border)] focus:ring-[3px] focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});

export { Input };
