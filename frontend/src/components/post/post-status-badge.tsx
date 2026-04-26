import type { PostStatus } from "../../generated-openapi/models";
import { cn } from "../../utils/cn";

type PostStatusBadgeProps = {
  status: PostStatus;
};

const statusStyles: Record<PostStatus, string> = {
  Draft: "border-white/10 bg-white/5 text-muted-foreground",
  Published: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
  Archived: "border-amber-400/25 bg-amber-400/10 text-amber-300"
};

export function PostStatusBadge({ status }: PostStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em]",
        statusStyles[status]
      )}
    >
      {status}
    </span>
  );
}
