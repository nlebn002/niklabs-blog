import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input(
  { className, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-2xl border border-fog bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-clay focus:ring-2 focus:ring-amber-200",
        className
      )}
      {...props}
    />
  );
});
