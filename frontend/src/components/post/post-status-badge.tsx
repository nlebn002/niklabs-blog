import { cn } from "../../utils/cn";

type PostStatusBadgeProps = {
  isPublished: boolean;
};

export function PostStatusBadge({ isPublished }: PostStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
        isPublished ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"
      )}
    >
      {isPublished ? "Published" : "Draft"}
    </span>
  );
}
