import { Skeleton } from "@/components/ui/skeleton";
import { cx } from "./shared";

export function LoadingState({
  className,
  label = "Loading rows",
  rows = 3,
  variant = "list",
}: {
  className?: string;
  label?: string;
  rows?: number;
  variant?: "list" | "form" | "profile";
}) {
  const items = Array.from({ length: rows }, (_, index) => index);

  if (variant === "profile") {
    return (
      <div
        aria-busy="true"
        aria-label={label}
        className={cx("grid gap-5", className)}
        role="status"
      >
        <div className="flex items-start gap-3">
          <Skeleton className="size-16 shrink-0 rounded-full" />
          <div className="grid flex-1 gap-2 pt-1">
            <Skeleton className="h-6 w-48 max-w-full" />
            <Skeleton className="h-4 w-36 max-w-full" />
            <Skeleton className="h-4 w-full max-w-xl" />
          </div>
        </div>
        <Skeleton className="h-10 w-44" />
      </div>
    );
  }

  if (variant === "form") {
    return (
      <div
        aria-busy="true"
        aria-label={label}
        className={cx("grid gap-4", className)}
        role="status"
      >
        {items.map((item) => (
          <div key={item} className="grid gap-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
        <Skeleton className="ml-auto h-10 w-32" />
      </div>
    );
  }

  return (
    <div
      aria-busy="true"
      aria-label={label}
      className={cx("grid gap-2 rounded-lg bg-white", className)}
      role="status"
    >
      {items.map((item) => (
        <Skeleton key={item} className="h-10 w-full" />
      ))}
    </div>
  );
}
