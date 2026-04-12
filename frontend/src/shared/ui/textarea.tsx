import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "../lib/cn";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea(
  { className, ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-2xl border border-fog bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-clay focus:ring-2 focus:ring-amber-200",
        className
      )}
      {...props}
    />
  );
});
