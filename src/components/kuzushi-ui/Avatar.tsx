import { cx } from "./shared";

export function Avatar({
  initials = "KC",
  src,
  size = "md",
}: {
  initials?: string;
  src?: string;
  size?: "xs" | "sm" | "md" | "lg";
}) {
  return (
    <span
      aria-label={src ? `${initials} profile photo` : undefined}
      role={src ? "img" : undefined}
      className={cx(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-zinc-900 bg-cover bg-center font-semibold text-white",
        size === "xs" && "size-6 text-[10px]",
        size === "sm" && "size-8 text-xs",
        size === "md" && "size-10 text-sm",
        size === "lg" && "size-20 text-xl",
      )}
      style={src ? { backgroundImage: `url("${src}")` } : undefined}
    >
      {src ? <span className="sr-only">{initials}</span> : initials}
    </span>
  );
}
