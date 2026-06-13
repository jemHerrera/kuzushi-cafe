"use client";

import { Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DestructiveConfirmDialog } from "./DestructiveConfirmDialog";
import { TechniqueCategoryPillSelect } from "./TechniqueCategoryPillSelect";
import {
  sampleTechniques,
  savedTagCategories,
  type Category,
  type Technique,
} from "./shared";

type SavedTechniqueTagItemProps = {
  technique?: Technique;
  onNameChange?: (name: string) => void;
  onCategoryChange?: (category: Category) => void;
  onDelete?: () => Promise<void> | void;
  disabled?: boolean;
};

export function SavedTechniqueTagItem({
  technique = sampleTechniques[0],
  onNameChange,
  onCategoryChange,
  onDelete,
  disabled = false,
}: SavedTechniqueTagItemProps) {
  const [internalTechnique, setInternalTechnique] = useState(technique);
  const [draftName, setDraftName] = useState(technique.name);
  const [isDeleted, setIsDeleted] = useState(false);
  const skipNextBlurCommit = useRef(false);
  const currentName = onNameChange ? technique.name : internalTechnique.name;
  const currentCategory = onCategoryChange
    ? technique.category
    : internalTechnique.category;

  function commitName() {
    if (skipNextBlurCommit.current) {
      skipNextBlurCommit.current = false;
      return;
    }

    const nextName = draftName.trim();

    if (!nextName) {
      setDraftName(currentName);
      return;
    }

    setDraftName(nextName);

    if (nextName === currentName) return;

    setInternalTechnique((current) => ({ ...current, name: nextName }));
    onNameChange?.(nextName);
  }

  function changeCategory(category: Category) {
    setInternalTechnique((current) => ({ ...current, category }));
    onCategoryChange?.(category);
  }

  function restoreName(input: HTMLInputElement) {
    skipNextBlurCommit.current = true;
    setDraftName(currentName);
    input.blur();
  }

  if (isDeleted) return null;

  return (
    <div
      className="grid w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-1 rounded-md p-1"
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      <Input
        aria-label={`Technique label: ${currentName}`}
        className="h-8 min-w-0 border-transparent bg-transparent px-2 text-sm text-zinc-950 shadow-none focus-visible:border-transparent focus-visible:bg-zinc-50 focus-visible:ring-0"
        value={draftName}
        disabled={disabled}
        onBlur={commitName}
        onChange={(event) => setDraftName(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            event.currentTarget.blur();
          }

          if (event.key === "Escape") {
            event.preventDefault();
            restoreName(event.currentTarget);
          }
        }}
      />
      <TechniqueCategoryPillSelect
        disabled={disabled}
        options={savedTagCategories}
        value={currentCategory}
        onValueChange={changeCategory}
        variant="small"
      />
      <DestructiveConfirmDialog
        actionLabel="Delete technique"
        description="This technique will be removed from your saved techniques. This action cannot be undone."
        disabled={disabled}
        onConfirm={async () => {
          if (onDelete) {
            await onDelete();
          } else {
            setIsDeleted(true);
          }
        }}
        pendingLabel="Deleting..."
        title={`Delete "${currentName}"?`}
      >
        <Button
          aria-label={`Delete ${currentName}`}
          title="Delete technique"
          type="button"
          variant="ghost"
          size="icon-lg"
          className="rounded-md text-zinc-500 hover:text-red-700"
          disabled={disabled}
        >
          <Trash2 className="size-4" />
        </Button>
      </DestructiveConfirmDialog>
    </div>
  );
}
