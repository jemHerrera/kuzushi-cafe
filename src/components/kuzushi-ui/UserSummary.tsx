import { Avatar } from "./Avatar";
import { beltBorderStyles, cx, samplePartners, type Partner } from "./shared";

export function UserSummary({
  partner = samplePartners[0],
}: {
  partner?: Partner;
}) {
  return (
    <div className="flex items-center gap-3 bg-white">
      <span
        className={cx(
          "inline-flex shrink-0 rounded-full border-4 p-0",
          beltBorderStyles[partner.belt],
        )}
      >
        <Avatar initials={partner.initials} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-zinc-950">
          {partner.firstName} {partner.lastName}
        </p>
        <p className="text-xs capitalize text-zinc-600">{partner.belt} belt</p>
      </div>
    </div>
  );
}
