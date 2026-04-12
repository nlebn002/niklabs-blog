import type { HTMLAttributes, PropsWithChildren } from "react";
import { cn } from "../lib/cn";

type PanelProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>;

export function Panel({ children, className, ...props }: PanelProps) {
  return (
    <section
      className={cn(
        "grid rounded-[2rem] border border-amber-200/60 bg-white/90 p-6 shadow-card backdrop-blur lg:p-8",
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}
