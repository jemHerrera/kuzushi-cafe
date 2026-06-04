import { ButtonSecondary } from "./ButtonSecondary";
import { IconButton } from "./IconButton";
import { ModalFrame } from "./ModalFrame";
import { TrainingPartnerSearch } from "./TrainingPartnerSearch";
import { UserSummary } from "./UserSummary";
import { samplePartners } from "./shared";

export function TrainingPartnersListModal() {
  return (
    <ModalFrame title="Training partners">
      <TrainingPartnerSearch />
      <div className="grid gap-2">
        {samplePartners.map((partner) => (
          <div key={partner.initials} className="flex items-center gap-2">
            <UserSummary partner={partner} />
            <IconButton label="Remove training partner" icon="-" />
          </div>
        ))}
      </div>
      <ButtonSecondary>Add custom training partner</ButtonSecondary>
    </ModalFrame>
  );
}
