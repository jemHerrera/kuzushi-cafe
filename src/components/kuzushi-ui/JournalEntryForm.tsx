import { ButtonPrimary } from "./ButtonPrimary";
import { ButtonSecondary } from "./ButtonSecondary";
import { CategorySelect } from "./CategorySelect";
import { DateSelector } from "./DateSelector";
import { ModalFrame } from "./ModalFrame";
import { TechniqueTagSelectMenu } from "./TechniqueTagSelectMenu";
import { TrainingPartnerInput } from "./TrainingPartnerInput";
import { Field, SelectInput } from "./shared";

export function JournalEntryForm({ mode }: { mode: "create" | "update" }) {
  return (
    <ModalFrame title={mode === "create" ? "Add journal entry" : "Update journal entry"}>
      <CategorySelect />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Technique">
          <TechniqueTagSelectMenu />
        </Field>
        <Field label="Setup">
          <TechniqueTagSelectMenu search="collar grip" />
        </Field>
      </div>
      <Field label="Notes">
        <textarea
          className="min-h-28 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm"
          defaultValue="Focused on keeping elbow position tight before finishing."
        />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Intensity">
          <SelectInput>
            <option>Moderate</option>
            <option>High</option>
          </SelectInput>
        </Field>
        <Field label="Trained date">
          <DateSelector />
        </Field>
      </div>
      <TrainingPartnerInput />
      <label className="flex items-center gap-2 text-sm font-medium text-zinc-800">
        <input type="checkbox" defaultChecked /> This is an attempt
      </label>
      <label className="flex items-center gap-2 text-sm font-medium text-zinc-800">
        <input type="checkbox" defaultChecked /> This technique was successful
      </label>
      <div className="flex flex-wrap justify-between gap-3">
        {mode === "update" ? <ButtonSecondary>Delete entry</ButtonSecondary> : <span />}
        <ButtonPrimary>{mode === "create" ? "Add entry" : "Update entry"}</ButtonPrimary>
      </div>
    </ModalFrame>
  );
}
