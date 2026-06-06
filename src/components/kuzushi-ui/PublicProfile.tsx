import { UserMinus, UserPlus } from "lucide-react";
import { AggregateOverview } from "./AggregateOverview";
import { Avatar } from "./Avatar";
import { ButtonPrimary } from "./ButtonPrimary";
import { ButtonSecondary } from "./ButtonSecondary";
import { JournalEntryTable } from "./JournalEntryTable";
import { ModalFrame } from "./ModalFrame";
import { getPartnerProfileMeta, samplePartners, type Partner } from "./shared";

export function PublicProfile({
  partner = samplePartners[0],
  onClose,
  withinDialog = false,
}: {
  partner?: Partner;
  onClose?: () => void;
  withinDialog?: boolean;
}) {
  return (
    <ModalFrame onClose={onClose} withinDialog={withinDialog}>
      <div className="flex flex-wrap items-center gap-4">
        <Avatar initials={partner.initials} size="lg" />
        <div>
          <h3 className="text-xl font-bold text-zinc-950">
            {partner.firstName} {partner.lastName}
          </h3>
          <p className="text-sm capitalize text-zinc-600">
            {getPartnerProfileMeta(partner)}
          </p>
        </div>
        <div className="ml-auto flex flex-wrap gap-2">
          <ButtonPrimary>
            <UserPlus className="size-4" />
            Add partner
          </ButtonPrimary>
          <ButtonSecondary>
            <UserMinus className="size-4" />
            Remove
          </ButtonSecondary>
        </div>
      </div>
      <AggregateOverview />
      <JournalEntryTable />
    </ModalFrame>
  );
}
