import { Plus, Save, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ButtonPrimary } from "./ButtonPrimary";
import { ButtonSecondary } from "./ButtonSecondary";
import { DateSelector } from "./DateSelector";
import { ModalFrame } from "./ModalFrame";
import { TechniqueCategoryPillSelect } from "./TechniqueCategoryPillSelect";
import { TechniqueTagSelectMenu } from "./TechniqueTagSelectMenu";
import { TrainingPartnerInput } from "./TrainingPartnerInput";
import { Field, SelectInput } from "./shared";

export function JournalEntryForm({
  mode,
  onClose,
  withinDialog = false,
}: {
  mode: "create" | "update";
  onClose?: () => void;
  withinDialog?: boolean;
}) {
  return (
    <ModalFrame
      title={mode === "create" ? "Add journal entry" : "Update journal entry"}
      onClose={onClose}
      withinDialog={withinDialog}
    >
      <Field label="Category">
        <TechniqueCategoryPillSelect />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Technique">
          <TechniqueTagSelectMenu />
        </Field>
        <Field label="Setup">
          <TechniqueTagSelectMenu search="collar grip" />
        </Field>
      </div>
      <Field label="Notes">
        <Textarea
          className="min-h-28 rounded-md bg-white px-3 py-2 text-sm"
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
      <Label className="flex items-center gap-2 text-sm font-medium text-zinc-800">
        <Checkbox defaultChecked /> This is an attempt
      </Label>
      <Label className="flex items-center gap-2 text-sm font-medium text-zinc-800">
        <Checkbox defaultChecked /> This technique was successful
      </Label>
      <div className="flex flex-wrap justify-between gap-3">
        {mode === "update" ? (
          <ButtonSecondary>
            <Trash2 className="size-4" />
            Delete entry
          </ButtonSecondary>
        ) : (
          <span />
        )}
        <ButtonPrimary>
          {mode === "create" ? <Plus className="size-4" /> : <Save className="size-4" />}
          {mode === "create" ? "Add entry" : "Update entry"}
        </ButtonPrimary>
      </div>
    </ModalFrame>
  );
}
