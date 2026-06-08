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
import { Avatar } from "./Avatar";
import { JournalEntryUpdate } from "./JournalEntryUpdate";
import { JournalTypePillSelect } from "./JournalTypePillSelect";
import { TechniqueCategoryPill } from "./TechniqueCategoryPill";
import { TechniqueCategoryPillSelect } from "./TechniqueCategoryPillSelect";
import { TechniqueTagSelectMenu } from "./TechniqueTagSelectMenu";
import { TrainingPartnerSelectMenu } from "./TrainingPartnerSelectMenu";
import {
  samplePartners,
  sampleTechniques,
  beltBorderStyles,
  cx,
  type JournalEntry,
  type Technique,
} from "./shared";

type JournalEntryRowProps = {
  entry: JournalEntry;
  onChange?: (entry: JournalEntry) => void;
  onDelete?: () => void;
  readOnly?: boolean;
};

export function JournalEntryRow({
  entry,
  onChange,
  onDelete,
  readOnly = false,
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
  if (readOnly) return <ReadOnlyJournalEntryRow entry={currentEntry} />;

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
              This journal entry will be permanently removed. This action cannot
              be undone.
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

function ReadOnlyJournalEntryRow({ entry }: { entry: JournalEntry }) {
  return (
    <tr className="border-t border-zinc-200 bg-white">
      <td className="overflow-hidden whitespace-nowrap px-3 py-3">
        <TechniqueCategoryPill category={entry.category} />
      </td>
      <td className="overflow-hidden px-3 py-3">
        <p className="truncate text-sm font-medium text-zinc-950">
          {entry.technique}
        </p>
        {entry.setup ? (
          <p className="truncate text-xs text-zinc-500">from {entry.setup}</p>
        ) : null}
      </td>
      <td className="overflow-hidden whitespace-nowrap px-3 py-3">
        {entry.journalType ? (
          <span className="inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs font-semibold capitalize text-zinc-700">
            {entry.journalType}
          </span>
        ) : (
          <span className="text-xs text-zinc-500">Not collected</span>
        )}
      </td>
      <td className="overflow-hidden whitespace-nowrap px-3 py-3">
        {entry.partner ? (
          <span className="flex min-w-0 items-center gap-2">
            <span
              className={cx(
                "inline-flex shrink-0 rounded-full border-2",
                beltBorderStyles[entry.partner.belt],
              )}
            >
              <Avatar initials={entry.partner.initials} size="xs" />
            </span>
            <span className="truncate text-sm font-medium text-zinc-900">
              {entry.partner.firstName} {entry.partner.lastName}
            </span>
          </span>
        ) : (
          <span className="text-sm text-zinc-500">No partner</span>
        )}
      </td>
      <td className="overflow-hidden whitespace-nowrap px-3 py-3 text-sm text-zinc-700">
        {format(parseISO(entry.trainedDate), "MMMM dd, yyyy")}
      </td>
    </tr>
  );
}
