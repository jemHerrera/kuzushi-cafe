import { Avatar } from "./Avatar";
import { beltBorderStyles, cx, samplePartners, type Partner } from "./shared";

export function UserSummary({
  partner,
  identity,
  className,
  meta,
}: {
  partner?: Partner;
  identity?: {
    firstName?: string;
    lastName?: string;
    belt: Partner["belt"];
    profilePhoto?: string;
  };
  className?: string;
  meta?: string;
}) {
  const summary = identity ?? partner ?? samplePartners[0];
  const name =
    [summary.firstName, summary.lastName].filter(Boolean).join(" ") ||
    "Kuzushi member";
  const initials =
    "initials" in summary && summary.initials
      ? summary.initials
      : [summary.firstName, summary.lastName]
          .filter(Boolean)
          .map((part) => part?.charAt(0).toUpperCase())
          .join("") || "KC";
  const profilePhoto =
    "profilePhoto" in summary ? summary.profilePhoto : undefined;

  return (
    <span className={cx("flex items-center gap-3 bg-white", className)}>
      <span
        className={cx(
          "inline-flex shrink-0 rounded-full border-4 p-0",
          beltBorderStyles[summary.belt ?? "unknown"],
        )}
      >
        <Avatar initials={initials} src={profilePhoto} size="sm" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-zinc-950">
          {name}
        </span>
        <span className="block text-xs capitalize text-zinc-600">
          {meta ?? `${summary.belt ?? "unknown"} belt`}
        </span>
      </span>
    </span>
  );
}
