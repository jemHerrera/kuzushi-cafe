"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { ButtonPrimary } from "./ButtonPrimary";
import { TechniqueCategoryPillSelect } from "./TechniqueCategoryPillSelect";
import { type Category } from "./shared";

type SavedTechniqueUpsertProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSave?: (technique: { label: string; category: Category }) => void;
};

export function SavedTechniqueUpsert({
  open,
  onOpenChange,
  onSave,
}: SavedTechniqueUpsertProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [category, setCategory] = useState<Category>("submission");
  const isControlled = open !== undefined;
  const isOpen = open ?? internalOpen;

  function changeOpen(nextOpen: boolean) {
    if (!isControlled) {
      setInternalOpen(nextOpen);
    }

    onOpenChange?.(nextOpen);
  }

  function saveTechnique() {
    const trimmedLabel = label.trim();

    if (!trimmedLabel) return;

    onSave?.({ label: trimmedLabel, category });
    setLabel("");
    setCategory("submission");
    changeOpen(false);
  }

  return (
    <Popover open={isOpen} onOpenChange={changeOpen}>
      <PopoverTrigger asChild>
        <ButtonPrimary type="button">
          <Plus className="size-4" />
          Add
        </ButtonPrimary>
      </PopoverTrigger>
      <PopoverContent className="w-60 gap-2 p-2" align="end">
        <Input
          autoFocus
          aria-label="Technique label"
          className="h-8 rounded-md px-2 text-sm border-transparent bg-transparent text-zinc-950 shadow-none focus-visible:border-transparent focus-visible:bg-zinc-50 focus-visible:ring-0"
          placeholder="Add technique label"
          value={label}
          onChange={(event) => setLabel(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              saveTechnique();
            }
          }}
        />
        <TechniqueCategoryPillSelect
          value={category}
          onValueChange={setCategory}
        />
        <ButtonPrimary
          className="w-full h-8 text-sm"
          disabled={!label.trim()}
          onClick={saveTechnique}
          type="button"
        >
          Save
        </ButtonPrimary>
      </PopoverContent>
    </Popover>
  );
}
