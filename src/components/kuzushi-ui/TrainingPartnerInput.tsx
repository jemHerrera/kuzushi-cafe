import { TrainingPartnerSelectMenu } from "./TrainingPartnerSelectMenu";

export function TrainingPartnerInput({
  showLabel = true,
  variant = "default",
  ariaLabel,
}: {
  showLabel?: boolean;
  variant?: "default" | "property";
  ariaLabel?: string;
} = {}) {
  if (!showLabel) {
    return (
      <TrainingPartnerSelectMenu ariaLabel={ariaLabel} variant={variant} />
    );
  }

  return (
    <div className="grid gap-2">
      <span className="text-sm font-medium leading-normal text-zinc-800">
        Partner
      </span>
      <TrainingPartnerSelectMenu ariaLabel={ariaLabel} variant={variant} />
    </div>
  );
}
