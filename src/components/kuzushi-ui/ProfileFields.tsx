import { Award, Cake, Scale, UserRound } from "lucide-react";
import { DateSelector } from "./DateSelector";
import { PropertyField } from "./PropertyField";
import {
  belts,
  formatBelt,
  formatWeightClassOption,
  SelectInput,
  TextInput,
  weightClasses,
} from "./shared";

export function ProfileFields() {
  return (
    <div className="grid">
      <PropertyField icon={UserRound} label="First name">
        <TextInput
          aria-label="First name"
          placeholder="Add first name"
          value="Jem"
          variant="property"
        />
      </PropertyField>
      <PropertyField icon={UserRound} label="Last name">
        <TextInput
          aria-label="Last name"
          placeholder="Add last name"
          value="Herrera"
          variant="property"
        />
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
      <PropertyField icon={Scale} label="Weight">
        <SelectInput aria-label="Weight" variant="property">
          {weightClasses.map((weight) => (
            <option key={weight} value={weight}>
              {formatWeightClassOption(weight)}
            </option>
          ))}
        </SelectInput>
      </PropertyField>
      <PropertyField icon={Cake} label="Birthday">
        <DateSelector
          ariaLabel="Birthday"
          placeholder="Add birthday"
          variant="property"
        />
      </PropertyField>
    </div>
  );
}
