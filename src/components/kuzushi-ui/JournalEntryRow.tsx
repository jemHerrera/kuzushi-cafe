"use client";

import { format, parseISO } from "date-fns";
import { Ellipsis, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DateSelector } from "./DateSelector";
import { JournalEntryUpdate } from "./JournalEntryUpdate";
import { JournalTypePillSelect } from "./JournalTypePillSelect";
import { TechniqueCategoryPillSelect } from "./TechniqueCategoryPillSelect";
import { TechniqueTagSelectMenu } from "./TechniqueTagSelectMenu";
import { TrainingPartnerSelectMenu } from "./TrainingPartnerSelectMenu";
import {
  samplePartners,
  sampleTechniques,
  type JournalEntry,
  type Technique,
} from "./shared";

type JournalEntryRowProps = {
  entry: JournalEntry;
  onChange?: (entry: JournalEntry) => void;
  onDelete?: () => void;
};

export function JournalEntryRow({
  entry,
  onChange,
  onDelete,
}: JournalEntryRowProps) {
  const [internalEntry, setInternalEntry] = useState(entry);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const currentEntry = onChange ? entry : internalEntry;
  const trainedDate = parseISO(currentEntry.trainedDate);
  const selectedTechnique: Technique = {
    name: currentEntry.technique,
    category: currentEntry.category,
  };

  function updateEntry(changes: Partial<JournalEntry>) {
    const nextEntry = { ...currentEntry, ...changes };
    setInternalEntry(nextEntry);
    onChange?.(nextEntry);
  }

  function deleteEntry() {
    if (onDelete) {
      onDelete();
    } else {
      setIsDeleted(true);
    }
  }

  if (isDeleted) return null;

  return (
    <>
      <tr className="border-t border-zinc-200 bg-white">
        <td className="overflow-hidden whitespace-nowrap px-3 py-2">
          <TechniqueCategoryPillSelect
            value={currentEntry.category}
            variant="table"
            onValueChange={(category) =>
              updateEntry({
                category,
                journalType:
                  category === "tap"
                    ? undefined
                    : (currentEntry.journalType ?? "attempt"),
              })
            }
          />
        </td>
        <td className="overflow-hidden px-3 py-2">
          <TechniqueTagSelectMenu
            ariaLabel="Technique"
            techniques={sampleTechniques}
            value={selectedTechnique}
            variant="table"
            onSelectTechnique={(technique) =>
              updateEntry({ technique: technique.name })
            }
          />
          {currentEntry.setup ? (
            <p className="px-1 text-xs text-zinc-500">
              from {currentEntry.setup}
            </p>
          ) : null}
        </td>
        <td className="overflow-hidden whitespace-nowrap px-3 py-2">
          {currentEntry.journalType ? (
            <JournalTypePillSelect
              value={currentEntry.journalType}
              onValueChange={(journalType) => updateEntry({ journalType })}
            />
          ) : (
            <span className="text-xs text-zinc-500">Not collected</span>
          )}
        </td>
        <td className="overflow-hidden whitespace-nowrap px-3 py-2">
          <TrainingPartnerSelectMenu
            ariaLabel="Training partner"
            partners={samplePartners}
            placeholder="No partner"
            value={currentEntry.partner ?? null}
            variant="table"
            onSelectPartner={(partner) => updateEntry({ partner })}
            onSelectUnknownPartner={() => updateEntry({ partner: undefined })}
          />
        </td>
        <td className="overflow-hidden whitespace-nowrap px-3 py-2">
          <DateSelector
            ariaLabel="Trained date"
            value={trainedDate}
            variant="table"
            onValueChange={(date) => {
              if (date) {
                updateEntry({ trainedDate: format(date, "yyyy-MM-dd") });
              }
            }}
          />
        </td>
        <td className="w-12 whitespace-nowrap px-2 py-2 text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Journal entry actions"
                title="Journal entry actions"
                type="button"
                variant="ghost"
                size="icon-sm"
              >
                <Ellipsis className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setIsEditOpen(true)}>
                <Pencil className="size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-700 focus:text-red-700"
                onSelect={() => setIsDeleteOpen(true)}
              >
                <Trash2 className="size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      </tr>
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent
          className="max-h-[calc(100vh-2rem)] max-w-2xl overflow-y-auto bg-transparent p-0 ring-0 sm:max-w-2xl"
          showCloseButton={false}
        >
          <DialogDescription className="sr-only">
            Update this journal entry.
          </DialogDescription>
          <JournalEntryUpdate
            onClose={() => setIsEditOpen(false)}
            withinDialog
          />
        </DialogContent>
      </Dialog>
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
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
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={deleteEntry}
            >
              Delete entry
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
