import { DateSelector } from "./DateSelector";
import {
  ageClasses,
  belts,
  Field,
  formatAgeClassOption,
  formatBelt,
  formatWeightClassOption,
  SelectInput,
  TextInput,
  weightClasses,
} from "./shared";

export function ProfileFields({
  useAgeClass = false,
}: {
  useAgeClass?: boolean;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field label="First name">
        <TextInput value="Jem" />
      </Field>
      <Field label="Last name">
        <TextInput value="Herrera" />
      </Field>
      <Field label="Belt">
        <SelectInput>
          {belts.map((belt) => (
            <option key={belt} value={belt}>
              {formatBelt(belt)}
            </option>
          ))}
        </SelectInput>
      </Field>
      <Field label="Weight">
        <SelectInput>
          {weightClasses.map((weight) => (
            <option key={weight} value={weight}>
              {formatWeightClassOption(weight)}
            </option>
          ))}
        </SelectInput>
      </Field>
      {useAgeClass ? (
        <Field label="Age">
          <SelectInput>
            {ageClasses.map((age) => (
              <option key={age} value={age}>
                {formatAgeClassOption(age)}
              </option>
            ))}
          </SelectInput>
        </Field>
      ) : (
        <Field label="Birthday">
          <DateSelector />
        </Field>
      )}
    </div>
  );
}
