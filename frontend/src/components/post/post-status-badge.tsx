import type { PostStatus } from "../../generated-openapi/models";
import { cn } from "../../utils/cn";

type PostStatusBadgeProps = {
  status: PostStatus;
};

const statusStyles: Record<PostStatus, string> = {
  Draft: "bg-slate-100 text-slate-700",
  Published: "bg-emerald-100 text-emerald-700",
  Archived: "bg-amber-100 text-amber-700"
};

export function PostStatusBadge({ status }: PostStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
        statusStyles[status]
      )}
    >
      {status}
    </span>
  );
}
