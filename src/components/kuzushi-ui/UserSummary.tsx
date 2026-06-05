import { Avatar } from "./Avatar";
import { beltBorderStyles, cx, samplePartners, type Partner } from "./shared";

export function UserSummary({
  partner = samplePartners[0],
  className,
  meta,
}: {
  partner?: Partner;
  className?: string;
  meta?: string;
}) {
  return (
    <span className={cx("flex items-center gap-3 bg-white", className)}>
      <span
        className={cx(
          "inline-flex shrink-0 rounded-full border-4 p-0",
          beltBorderStyles[partner.belt],
        )}
      >
        <Avatar initials={partner.initials} size="sm" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-zinc-950">
          {partner.firstName} {partner.lastName}
        </span>
        <span className="block text-xs capitalize text-zinc-600">
          {meta ?? `${partner.belt} belt`}
        </span>
      </span>
    </span>
  );
}
