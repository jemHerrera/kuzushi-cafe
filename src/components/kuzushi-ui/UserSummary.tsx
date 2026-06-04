import { Avatar } from "./Avatar";
import { beltStyles, cx, samplePartners, type Partner } from "./shared";

export function UserSummary({ partner = samplePartners[0] }: { partner?: Partner }) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-zinc-200 bg-white p-3">
      <Avatar initials={partner.initials} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-zinc-950">
          {partner.firstName} {partner.lastName}
        </p>
        <p className="text-xs capitalize text-zinc-600">{partner.belt} belt</p>
      </div>
      <span
        className={cx(
          "rounded-full px-2 py-0.5 text-xs font-semibold ring-1",
          beltStyles[partner.belt],
        )}
      >
        {partner.belt}
      </span>
    </div>
  );
}
