import { cx } from "./shared";

export function Avatar({
  initials = "KC",
  size = "md",
}: {
  initials?: string;
  size?: "xs" | "sm" | "md" | "lg";
}) {
  return (
    <span
      className={cx(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-zinc-900 font-semibold text-white",
        size === "xs" && "size-6 text-[10px]",
        size === "sm" && "size-8 text-xs",
        size === "md" && "size-10 text-sm",
        size === "lg" && "size-20 text-xl",
      )}
    >
      {initials}
    </span>
  );
}
