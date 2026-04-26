import type { PostStatus } from "../../generated-openapi/models";
import { cn } from "../../utils/cn";

type PostStatusBadgeProps = {
  status: PostStatus;
};

const statusStyles: Record<number, string> = {
  0: "border-white/10 bg-white/5 text-muted-foreground",
  1: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
  2: "border-amber-400/25 bg-amber-400/10 text-amber-300"
};

const statusLabels: Record<number, string> = {
  0: "Draft",
  1: "Published",
  2: "Archived"
};

export function PostStatusBadge({ status }: PostStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em]",
        statusStyles[status]
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
