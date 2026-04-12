import { cn } from "../../../shared/lib/cn";

type PostStatusBadgeProps = {
  isPublished: boolean;
};

export function PostStatusBadge({ isPublished }: PostStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
        isPublished ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
      )}
    >
      {isPublished ? "Published" : "Draft"}
    </span>
  );
}
