import { ButtonPrimary } from "./ButtonPrimary";
import { TechniqueCategoryPillSelect } from "./TechniqueCategoryPillSelect";
import { Field, TextInput } from "./shared";

export function SavedTechniqueUpsert() {
  return (
    <div className="grid gap-3 rounded-md border border-zinc-200 bg-white p-3">
      <Field label="Name">
        <TextInput value="Armbar from closed guard" />
      </Field>
      <Field label="Category">
        <TechniqueCategoryPillSelect />
      </Field>
      <ButtonPrimary>Save technique</ButtonPrimary>
    </div>
  );
}
