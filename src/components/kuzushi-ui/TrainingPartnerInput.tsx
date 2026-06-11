import { TrainingPartnerSelectMenu } from "./TrainingPartnerSelectMenu";
import type { Partner } from "./shared";

export function TrainingPartnerInput({
  partners,
  value,
  onSelectPartner,
  onSelectUnknownPartner,
  showLabel = true,
  variant = "default",
  ariaLabel,
}: {
  partners?: Partner[];
  value?: Partner | null;
  onSelectPartner?: (partner: Partner) => void;
  onSelectUnknownPartner?: () => void;
  showLabel?: boolean;
  variant?: "default" | "property";
  ariaLabel?: string;
} = {}) {
  if (!showLabel) {
    return (
      <TrainingPartnerSelectMenu
        ariaLabel={ariaLabel}
        partners={partners}
        value={value}
        onSelectPartner={onSelectPartner}
        onSelectUnknownPartner={onSelectUnknownPartner}
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
        partners={partners}
        value={value}
        onSelectPartner={onSelectPartner}
        onSelectUnknownPartner={onSelectUnknownPartner}
        variant={variant}
      />
    </div>
  );
}
