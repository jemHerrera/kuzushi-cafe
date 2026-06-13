"use client";

import { Plus } from "lucide-react";
import { useState, type ReactNode } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { AlertBanner } from "./AlertBanner";
import { ButtonPrimary } from "./ButtonPrimary";
import { TechniqueCategoryPillSelect } from "./TechniqueCategoryPillSelect";
import { savedTagCategories, type Category } from "./shared";

type SavedTechniqueUpsertProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialLabel?: string;
  initialCategory?: Category;
  trigger?: ReactNode;
  presentation?: "popover" | "dialog";
  onSave?: (technique: {
    label: string;
    category: Category;
  }) => Promise<boolean | void> | boolean | void;
};

export function SavedTechniqueUpsert({
  open,
  onOpenChange,
  initialLabel = "",
  initialCategory = "submission",
  trigger,
  presentation = "popover",
  onSave,
}: SavedTechniqueUpsertProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [label, setLabel] = useState(initialLabel);
  const [category, setCategory] = useState<Category>(initialCategory);
  const [error, setError] = useState<string>();
  const [isSaving, setIsSaving] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = open ?? internalOpen;

  function changeOpen(nextOpen: boolean) {
    if (nextOpen) {
      setLabel(initialLabel);
      setCategory(initialCategory);
      setError(undefined);
    }
    if (!isControlled) setInternalOpen(nextOpen);
    onOpenChange?.(nextOpen);
  }

  async function saveTechnique() {
    const trimmedLabel = label.trim();
    if (!trimmedLabel || isSaving) return;

    setError(undefined);
    setIsSaving(true);
    try {
      const shouldClose = await onSave?.({
        label: trimmedLabel,
        category,
      });
      if (shouldClose === false) return;
      changeOpen(false);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "We could not save this technique.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  const form = (
    <div className="grid gap-2">
      {presentation === "dialog" ? (
        <>
          <DialogTitle>Save technique</DialogTitle>
          <DialogDescription>
            Add this technique to your saved techniques.
          </DialogDescription>
        </>
      ) : null}
      {error ? (
        <AlertBanner
          className="border-red-200 bg-red-50 text-red-900"
          message={error}
        />
      ) : null}
      <Input
        autoFocus
        aria-label="Technique label"
        className="h-8 rounded-md border-transparent bg-transparent px-2 text-sm text-zinc-950 shadow-none focus-visible:border-transparent focus-visible:bg-zinc-50 focus-visible:ring-0"
        disabled={isSaving}
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
        disabled={isSaving}
        options={savedTagCategories}
        value={category}
        onValueChange={setCategory}
      />
      <ButtonPrimary
        className="h-8 w-full text-sm"
        disabled={!label.trim() || isSaving}
        onClick={saveTechnique}
        type="button"
      >
        {isSaving ? "Saving..." : "Save"}
      </ButtonPrimary>
    </div>
  );

  if (presentation === "dialog") {
    return (
      <Dialog open={isOpen} onOpenChange={changeOpen}>
        <DialogContent className="sm:max-w-sm">{form}</DialogContent>
      </Dialog>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={changeOpen}>
      <PopoverTrigger asChild>
        {trigger ?? (
          <ButtonPrimary type="button">
            <Plus className="size-4" />
            Add
          </ButtonPrimary>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-72 p-2" align="end">
        {form}
      </PopoverContent>
    </Popover>
  );
}
