import type { HTMLAttributes, PropsWithChildren } from "react";
import { cn } from "@/utils/cn";

type PanelProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>;

export function Panel({ children, className, ...props }: PanelProps) {
  return (
    <section
      className={cn(
        "grid rounded-lg border border-border bg-card p-6 text-card-foreground shadow-card backdrop-blur lg:p-8",
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}
