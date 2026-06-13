"use client";

import { format, parseISO } from "date-fns";
import { Ellipsis, Pencil, Trash2, UserRound } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ApiErrorDetail } from "@/lib/managers/types";
import { Avatar } from "./Avatar";
import { DestructiveConfirmDialog } from "./DestructiveConfirmDialog";
import { JournalEntryUpdate } from "./JournalEntryUpdate";
import { TechniqueCategoryPill } from "./TechniqueCategoryPill";
import {
  beltBorderStyles,
  cx,
  formatIntensity,
  type JournalEntry,
  type Partner,
} from "./shared";

type JournalEntryRowProps = {
  entry: JournalEntry;
  onSaved?: () => void;
  onDeleted?: () => void;
  readOnly?: boolean;
};

export function JournalEntryRow({
  entry,
  onSaved,
  onDeleted,
  readOnly = false,
}: JournalEntryRowProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  async function deleteEntry() {
    const response = await fetch(`/api/journal-entries/${entry.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const detail = (await response.json()) as ApiErrorDetail;
      throw new Error(detail.error.message);
    }

    onDeleted?.();
  }

  return (
    <>
      <tr className="border-t border-zinc-200 bg-white md:hidden">
        <td colSpan={readOnly ? 5 : 6} className="p-0">
          <button
            type="button"
            className="grid min-h-16 w-full items-center gap-2 px-3 py-3 text-left transition hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring disabled:cursor-default"
            style={{
              gridTemplateColumns: "2fr 5fr 2fr 1fr",
            }}
            disabled={readOnly}
            onClick={() => setIsEditOpen(true)}
          >
            <span className="min-w-0 justify-self-start">
              <TechniqueCategoryPill category={entry.category} />
            </span>
            <span className="min-w-0 text-center">
              <span className="block truncate text-sm font-medium text-zinc-950">
                {entry.technique}
              </span>
              {entry.setup ? (
                <span className="block truncate text-xs text-zinc-500">
                  from {entry.setup}
                </span>
              ) : null}
            </span>
            <span className="justify-self-center self-center">
              {entry.journalType ? (
                <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs font-semibold capitalize text-zinc-700">
                  {entry.journalType}
                </span>
              ) : (
                <span className="text-xs text-zinc-400">—</span>
              )}
            </span>
            <span className="justify-self-end">
              <MobilePartnerAvatar partner={entry.partner} />
            </span>
          </button>
        </td>
      </tr>
      <tr className="border-t border-zinc-200 bg-white max-md:hidden">
        <td className="overflow-hidden whitespace-nowrap px-2 py-3">
          <TechniqueCategoryPill category={entry.category} />
        </td>
        <td className="overflow-hidden px-2 py-3">
          <p className="truncate text-sm font-medium text-zinc-950">
            {entry.technique}
          </p>
          {entry.setup ? (
            <p className="truncate text-xs text-zinc-500">from {entry.setup}</p>
          ) : null}
        </td>
        <td className="overflow-hidden whitespace-nowrap px-2 py-3">
          {entry.journalType ? (
            <span className="inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs font-semibold capitalize text-zinc-700">
              {entry.journalType}
            </span>
          ) : (
            <span className="text-xs text-zinc-500">Not collected</span>
          )}
        </td>
        <td className="overflow-hidden whitespace-nowrap px-2 py-3">
          <PartnerCell partner={entry.partner} />
        </td>
        <td className="overflow-hidden whitespace-nowrap px-2 py-3">
          <div className="grid gap-0.5">
            <span className="text-sm font-medium text-zinc-900">
              {format(parseISO(entry.trainedDate), "MMMM dd, yyyy")}
            </span>
            {entry.intensity ? (
              <span className="text-xs text-zinc-500">
                {formatIntensity(entry.intensity)}
              </span>
            ) : null}
          </div>
        </td>
        {!readOnly ? (
          <td className="w-10 whitespace-nowrap px-1 py-2 text-right">
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
        ) : null}
      </tr>
      {!readOnly ? (
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent
            className="max-h-[calc(100vh-2rem)] max-w-2xl overflow-y-auto bg-transparent p-0 ring-0 sm:max-w-2xl"
            showCloseButton={false}
          >
            <DialogDescription className="sr-only">
              Update this journal entry.
            </DialogDescription>
            <JournalEntryUpdate
              entry={entry}
              onClose={() => setIsEditOpen(false)}
              onSaved={onSaved}
              onDeleted={onDeleted}
              withinDialog
            />
          </DialogContent>
        </Dialog>
      ) : null}
      {!readOnly ? (
        <DestructiveConfirmDialog
          actionLabel="Delete entry"
          description="This journal entry will be permanently removed. This action cannot be undone."
          onConfirm={deleteEntry}
          onOpenChange={setIsDeleteOpen}
          open={isDeleteOpen}
          pendingLabel="Deleting..."
          title="Delete this journal entry?"
        />
      ) : null}
    </>
  );
}

function PartnerCell({ partner }: { partner?: Partner }) {
  if (!partner) {
    return <span className="text-sm text-zinc-500">No partner</span>;
  }

  const label = [partner.firstName, partner.lastName].filter(Boolean).join(" ");

  return (
    <span className="flex min-w-0 items-center gap-2">
      <span
        className={cx(
          "inline-flex shrink-0 rounded-full border-2",
          beltBorderStyles[partner.belt ?? "unknown"],
        )}
      >
        <Avatar initials={partner.initials} size="xs" />
      </span>
      <span className="truncate text-sm font-medium text-zinc-900">
        {label || "Unknown Partner"}
      </span>
    </span>
  );
}

function MobilePartnerAvatar({ partner }: { partner?: Partner }) {
  if (!partner) {
    return (
      <span
        aria-label="No training partner"
        className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-zinc-500"
      >
        <UserRound className="size-4" />
      </span>
    );
  }

  return (
    <span
      aria-label={
        [partner.firstName, partner.lastName].filter(Boolean).join(" ") ||
        "Training partner"
      }
      className={cx(
        "inline-flex shrink-0 rounded-full border-2",
        beltBorderStyles[partner.belt ?? "unknown"],
      )}
    >
      <Avatar initials={partner.initials} size="xs" />
    </span>
  );
}
