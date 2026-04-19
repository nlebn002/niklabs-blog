import type { HTMLAttributes, PropsWithChildren } from "react";
import { cn } from "@/utils/cn";

type PanelProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>;

export function Panel({ children, className, ...props }: PanelProps) {
  return (
    <section
      className={cn(
        "grid rounded-[2rem] border border-border/70 bg-card/90 p-6 text-card-foreground shadow-card backdrop-blur lg:p-8",
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}
