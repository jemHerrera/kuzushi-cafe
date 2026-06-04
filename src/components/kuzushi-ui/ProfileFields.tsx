import { DateSelector } from "./DateSelector";
import { Field, SelectInput, TextInput } from "./shared";

export function ProfileFields() {
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
          <option>Purple</option>
          <option>Brown</option>
        </SelectInput>
      </Field>
      <Field label="Weight">
        <SelectInput>
          <option>170 lb</option>
        </SelectInput>
      </Field>
      <Field label="Birthday">
        <DateSelector />
      </Field>
    </div>
  );
}
