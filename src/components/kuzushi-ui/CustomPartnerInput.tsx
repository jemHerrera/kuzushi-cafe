import { ArrowLeft, Plus } from "lucide-react";
import { ButtonPrimary } from "./ButtonPrimary";
import { ModalFrame } from "./ModalFrame";
import { Field, SelectInput, TextInput } from "./shared";

export function CustomPartnerInput() {
  return (
    <ModalFrame title="Add custom partner">
      <button className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-zinc-700">
        <ArrowLeft className="size-4" />
        Back
      </button>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="First name">
          <TextInput value="Alex" />
        </Field>
        <Field label="Last name">
          <TextInput value="Morgan" />
        </Field>
        <Field label="Weight">
          <SelectInput>
            <option>170 lb</option>
          </SelectInput>
        </Field>
        <Field label="Age">
          <SelectInput>
            <option>31</option>
          </SelectInput>
        </Field>
        <Field label="Belt">
          <SelectInput>
            <option>Blue</option>
            <option>Purple</option>
          </SelectInput>
        </Field>
      </div>
      <ButtonPrimary>
        <Plus className="size-4" />
        Add partner
      </ButtonPrimary>
    </ModalFrame>
  );
}
