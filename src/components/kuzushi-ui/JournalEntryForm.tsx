"use client";

import {
  CalendarDays,
  CircleCheck,
  Gauge,
  NotebookPen,
  Plus,
  Route,
  Shapes,
  Tag,
  Trash2,
  UserRound,
} from "lucide-react";
import { useId, useMemo, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { ButtonPrimary } from "./ButtonPrimary";
import { ButtonSecondary } from "./ButtonSecondary";
import { DateSelector } from "./DateSelector";
import { ModalFrame } from "./ModalFrame";
import { PropertyField } from "./PropertyField";
import { TechniqueCategoryPillSelect } from "./TechniqueCategoryPillSelect";
import { TechniqueTagSelectMenu } from "./TechniqueTagSelectMenu";
import { TrainingPartnerInput } from "./TrainingPartnerInput";
import {
  SelectInput,
  sampleTechniques,
  type Category,
  type Technique,
} from "./shared";

export function JournalEntryForm({
  mode,
  onClose,
  withinDialog = false,
}: {
  mode: "create" | "update";
  onClose?: () => void;
  withinDialog?: boolean;
}) {
  const [category, setCategory] = useState<Category>("submission");
  const [technique, setTechnique] = useState<Technique | null>(null);
  const notesId = useId();
  const intensityId = useId();
  const filteredTechniques = useMemo(
    () =>
      sampleTechniques.filter(
        (availableTechnique) => availableTechnique.category === category,
      ),
    [category],
  );

  function selectCategory(nextCategory: Category) {
    setCategory(nextCategory);
    setTechnique((currentTechnique) =>
      currentTechnique?.category === nextCategory ? currentTechnique : null,
    );
  }

  return (
    <ModalFrame
      title={mode === "create" ? "Add journal entry" : "Update journal entry"}
      onClose={onClose}
      withinDialog={withinDialog}
      className="p-3 sm:p-5"
    >
      <PropertyField icon={Shapes} label="Category">
        <TechniqueCategoryPillSelect
          value={category}
          onValueChange={selectCategory}
          variant="property"
        />
      </PropertyField>
      <PropertyField icon={Tag} label="Technique">
        <TechniqueTagSelectMenu
          techniques={filteredTechniques}
          value={technique}
          ariaLabel="Technique"
          onSelectTechnique={setTechnique}
          variant="property"
        />
      </PropertyField>
      <PropertyField
        icon={Route}
        label="Setup"
        description="Describe how you got to the technique, including positions, entries, or transitions that set it up."
        descriptionLabel="What is setup?"
      >
        <TechniqueTagSelectMenu
          ariaLabel="Setup"
          placeholder="Find or add setup"
          variant="property"
        />
      </PropertyField>
      <PropertyField
        icon={NotebookPen}
        label="Notes"
        description="Include what worked, what failed, adjustments to try, and details you want to remember next time."
        descriptionLabel="What should I include in notes?"
        htmlFor={notesId}
      >
        <Textarea
          id={notesId}
          className="min-h-10 resize-none border-transparent bg-transparent px-2 py-2 text-sm shadow-none hover:bg-zinc-100 focus-visible:border-transparent focus-visible:bg-zinc-100 focus-visible:ring-0"
          placeholder="Add notes"
        />
      </PropertyField>
      <PropertyField icon={Gauge} label="Intensity" htmlFor={intensityId}>
        <SelectInput id={intensityId} variant="property">
          <option value="">Select intensity</option>
          <option value="playful">Playful</option>
          <option value="casual">Casual</option>
          <option value="intense">Intense</option>
        </SelectInput>
      </PropertyField>
      <PropertyField icon={CalendarDays} label="Trained date">
        <DateSelector
          ariaLabel="Trained date"
          defaultToToday
          variant="property"
        />
      </PropertyField>
      <PropertyField icon={UserRound} label="Partner">
        <TrainingPartnerInput
          ariaLabel="Select training partner"
          showLabel={false}
          variant="property"
        />
      </PropertyField>
      {category !== "tap" ? (
        <PropertyField icon={CircleCheck} label="Outcome">
          <RadioGroup
            aria-label="Outcome"
            className="flex min-h-8 flex-wrap items-center gap-1"
            name="outcome"
          >
            <Label className="cursor-pointer min-h-10 rounded-md px-2 py-1 font-normal text-zinc-700 transition hover:bg-zinc-100 has-[[data-state=checked]]:bg-zinc-100 has-[[data-state=checked]]:text-zinc-950">
              <RadioGroupItem
                className="size-3.5 shadow-none cursor-pointer"
                value="attempt"
              />
              Attempt
            </Label>
            <Label className="cursor-pointer min-h-10 rounded-md px-2 py-1 font-normal text-zinc-700 transition hover:bg-zinc-100 has-[[data-state=checked]]:bg-zinc-100 has-[[data-state=checked]]:text-zinc-950">
              <RadioGroupItem
                className="size-3.5 shadow-none cursor-pointer"
                value="successful"
              />
              Successful
            </Label>
          </RadioGroup>
        </PropertyField>
      ) : null}
      <div className="flex flex-wrap justify-between gap-3">
        {mode === "update" ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <ButtonSecondary className="border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800">
                <Trash2 className="size-4" />
                Delete entry
              </ButtonSecondary>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this journal entry?</AlertDialogTitle>
                <AlertDialogDescription>
                  This journal entry will be permanently removed. This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-red-600 text-white hover:bg-red-700">
                  Delete entry
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <span />
        )}
        {mode === "create" && (
          <ButtonPrimary>
            <Plus className="size-4" />
            Add entry
          </ButtonPrimary>
        )}
      </div>
    </ModalFrame>
  );
}
