import {
  ArrowLeft,
  Award,
  CalendarClock,
  Plus,
  Scale,
  UserRound,
} from "lucide-react";
import { ButtonPrimary } from "./ButtonPrimary";
import { ModalFrame } from "./ModalFrame";
import { PropertyField } from "./PropertyField";
import {
  ageClasses,
  belts,
  formatAgeClassOption,
  formatBelt,
  formatWeightClassOption,
  SelectInput,
  TextInput,
  weightClasses,
} from "./shared";

export function CustomPartnerInput({
  onBack,
  onClose,
  withinDialog = false,
}: {
  onBack?: () => void;
  onClose?: () => void;
  withinDialog?: boolean;
}) {
  return (
    <ModalFrame
      title="Add custom partner"
      onClose={onClose}
      withinDialog={withinDialog}
      className="p-3 sm:p-5"
    >
      <button
        className="inline-flex w-fit items-center gap-2 rounded-md text-sm font-semibold text-zinc-700 transition hover:text-zinc-950 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        onClick={onBack}
        type="button"
      >
        <ArrowLeft className="size-4" />
        Back
      </button>
      <div className="grid">
        <PropertyField icon={UserRound} label="First name">
          <TextInput
            aria-label="First name"
            placeholder="Add first name"
            value="Alex"
            variant="property"
          />
        </PropertyField>
        <PropertyField icon={UserRound} label="Last name">
          <TextInput
            aria-label="Last name"
            placeholder="Add last name"
            value="Morgan"
            variant="property"
          />
        </PropertyField>
        <PropertyField icon={Scale} label="Weight">
          <SelectInput aria-label="Weight" variant="property">
            {weightClasses.map((weight) => (
              <option key={weight} value={weight}>
                {formatWeightClassOption(weight)}
              </option>
            ))}
          </SelectInput>
        </PropertyField>
        <PropertyField icon={CalendarClock} label="Age">
          <SelectInput aria-label="Age" variant="property">
            {ageClasses.map((age) => (
              <option key={age} value={age}>
                {formatAgeClassOption(age)}
              </option>
            ))}
          </SelectInput>
        </PropertyField>
        <PropertyField icon={Award} label="Belt">
          <SelectInput aria-label="Belt" variant="property">
            {belts.map((belt) => (
              <option key={belt} value={belt}>
                {formatBelt(belt)}
              </option>
            ))}
          </SelectInput>
        </PropertyField>
      </div>
      <div className="flex justify-end">
        <ButtonPrimary>
          <Plus className="size-4" />
          Add partner
        </ButtonPrimary>
      </div>
    </ModalFrame>
  );
}
