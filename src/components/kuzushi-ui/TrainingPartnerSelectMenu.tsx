import { UserPlus } from "lucide-react";
import { Avatar } from "./Avatar";
import { TrainingPartnerSearch } from "./TrainingPartnerSearch";
import { beltStyles, cx, samplePartners, type Partner } from "./shared";

export function TrainingPartnerSelectMenu({
  partners = samplePartners,
}: {
  partners?: Partner[];
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-3 shadow-sm">
      <TrainingPartnerSearch />
      <div className="mt-3 grid gap-2">
        <button className="rounded-md border border-zinc-200 px-3 py-2 text-left text-sm font-semibold text-zinc-900">
          No partner
        </button>
        {partners.map((partner) => (
          <button
            key={`${partner.firstName}-${partner.lastName}`}
            className="flex items-center gap-3 rounded-md border border-zinc-200 px-3 py-2 text-left hover:bg-zinc-50"
          >
            <Avatar initials={partner.initials} size="sm" />
            <span className="min-w-0 flex-1 text-sm font-medium text-zinc-900">
              {partner.firstName} {partner.lastName}
            </span>
            <span
              className={cx(
                "rounded-full px-2 py-0.5 text-xs font-semibold ring-1",
                beltStyles[partner.belt],
              )}
            >
              {partner.belt}
            </span>
          </button>
        ))}
        <button className="inline-flex items-center gap-2 rounded-md border border-dashed border-zinc-300 px-3 py-2 text-left text-sm font-semibold text-zinc-900">
          <UserPlus className="size-4" />
          Add custom partner
        </button>
      </div>
    </div>
  );
}
