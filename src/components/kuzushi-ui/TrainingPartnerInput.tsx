import { TrainingPartnerSelectMenu } from "./TrainingPartnerSelectMenu";
import type { Partner, TrainingPartnerDetail } from "./shared";

export function TrainingPartnerInput({
  partners,
  value,
  onSelectPartner,
  onSelectUnknownPartner,
  onCreateSavedPartner,
  createCustomPartnerSource,
  showLabel = true,
  variant = "default",
  ariaLabel,
  disabled = false,
}: {
  partners?: Partner[];
  value?: Partner | null;
  onSelectPartner?: (partner: Partner) => void;
  onSelectUnknownPartner?: () => void;
  onCreateSavedPartner?: (partner: TrainingPartnerDetail) => void;
  createCustomPartnerSource?: "journal-entry";
  showLabel?: boolean;
  variant?: "default" | "property";
  ariaLabel?: string;
  disabled?: boolean;
} = {}) {
  if (!showLabel) {
    return (
      <TrainingPartnerSelectMenu
        ariaLabel={ariaLabel}
        disabled={disabled}
        partners={partners}
        value={value}
        onSelectPartner={onSelectPartner}
        onSelectUnknownPartner={onSelectUnknownPartner}
        onCreateSavedPartner={onCreateSavedPartner}
        createCustomPartnerSource={createCustomPartnerSource}
        variant={variant}
      />
    );
  }

  return (
    <div className="grid gap-2">
      <span className="text-sm font-medium leading-normal text-zinc-800">
        Partner
      </span>
      <TrainingPartnerSelectMenu
        ariaLabel={ariaLabel}
        disabled={disabled}
        partners={partners}
        value={value}
        onSelectPartner={onSelectPartner}
        onSelectUnknownPartner={onSelectUnknownPartner}
        onCreateSavedPartner={onCreateSavedPartner}
        createCustomPartnerSource={createCustomPartnerSource}
        variant={variant}
      />
    </div>
  );
}
