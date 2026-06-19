"use client";

import { format, parseISO } from "date-fns";
import { Ellipsis, Pencil, Trash2, UserRound } from "lucide-react";
import Link from "next/link";
import { type KeyboardEvent, type MouseEvent, useState } from "react";
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
  BeltMarker,
  beltBorderStyles,
  cx,
  formatBelt,
  initialsForPartner,
  type JournalEntry,
  type Partner,
} from "./shared";

type JournalEntryRowProps = {
  entry: JournalEntry;
  onSaved?: () => void;
  onDeleted?: () => void;
  readOnly?: boolean;
  publicView?: boolean;
};

export function JournalEntryRow({
  entry,
  onSaved,
  onDeleted,
  readOnly = false,
  publicView = false,
}: JournalEntryRowProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const canEdit = !readOnly;
  const canOpenDetails = readOnly || canEdit;

  function openDetails() {
    if (canOpenDetails) setIsEditOpen(true);
  }

  function handleRowKeyDown(event: KeyboardEvent<HTMLTableRowElement>) {
    if (!canOpenDetails) return;
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    openDetails();
  }

  function stopRowClick(event: MouseEvent) {
    event.stopPropagation();
  }

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
      <tr className="border-t border-zinc-200 md:hidden">
        <td colSpan={readOnly ? 5 : 6} className="p-0">
          <div
            className="relative grid min-h-16 w-full items-center gap-2 px-0 md:px-2 py-2 text-left transition hover:bg-zinc-50"
            style={{
              gridTemplateColumns: "2fr 6fr 1fr",
            }}
          >
            {canOpenDetails ? (
              <button
                aria-label={`${canEdit ? "Edit" : "View"} ${entry.technique}`}
                className="absolute inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                type="button"
                onClick={openDetails}
              />
            ) : null}
            <span className="pointer-events-none min-w-0 justify-self-start">
              <TechniqueCategoryPill category={entry.category} />
            </span>
            <span className="pointer-events-none min-w-0 text-center">
              <span className="block truncate text-sm font-medium text-zinc-950">
                {entry.technique}
              </span>
              {entry.setup ? (
                <span className="block truncate text-xs text-zinc-500">
                  from {entry.setup}
                </span>
              ) : null}
            </span>
            {/* <span className="pointer-events-none justify-self-center self-center">
              {entry.journalType ? (
                <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs font-semibold capitalize text-zinc-700">
                  {entry.journalType}
                </span>
              ) : (
                <span className="text-xs text-zinc-400">—</span>
              )}
            </span> */}
            <span
              className={cx(
                "justify-self-end",
                !publicView && entry.partner?.accountId
                  ? "relative z-10"
                  : "pointer-events-none",
              )}
            >
              {publicView ? (
                <BeltIndicator partner={entry.partner} compact />
              ) : (
                <MobilePartnerAvatar partner={entry.partner} />
              )}
            </span>
          </div>
        </td>
      </tr>
      <tr
        aria-label={
          canOpenDetails
            ? `${canEdit ? "Edit" : "View"} ${entry.technique} journal entry`
            : undefined
        }
        className={cx(
          "border-t border-zinc-200 max-md:hidden",
          canOpenDetails &&
            "cursor-pointer transition hover:bg-zinc-50 focus-visible:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
        )}
        role={canOpenDetails ? "button" : undefined}
        tabIndex={canOpenDetails ? 0 : undefined}
        onClick={openDetails}
        onKeyDown={handleRowKeyDown}
      >
        <td className="overflow-hidden whitespace-nowrap px-2 py-3">
          <TechniqueCategoryPill category={entry.category} variant="small" />
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
        <td
          className="overflow-hidden whitespace-nowrap px-2 py-3"
          onClick={publicView ? undefined : stopRowClick}
        >
          {publicView ? (
            <BeltIndicator partner={entry.partner} />
          ) : (
            <PartnerCell partner={entry.partner} />
          )}
        </td>
        <td className="overflow-hidden whitespace-nowrap px-2 py-3">
          <div className="grid gap-0.5">
            <span className="text-sm font-medium text-zinc-900">
              {entry.trainedDate
                ? format(parseISO(entry.trainedDate), "MMMM dd, yyyy")
                : "Not collected"}
            </span>
          </div>
        </td>
        {!readOnly ? (
          <td
            className="w-10 whitespace-nowrap px-1 py-2 text-right"
            onClick={stopRowClick}
          >
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
      {canOpenDetails ? (
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent
            className="h-dvh max-h-dvh max-w-none overflow-y-auto bg-transparent p-0 ring-0 sm:h-auto sm:max-h-[calc(100vh-2rem)] sm:max-w-2xl"
            showCloseButton={false}
          >
            <DialogDescription className="sr-only">
              {readOnly
                ? "View this journal entry."
                : "Update this journal entry."}
            </DialogDescription>
            <JournalEntryUpdate
              entry={entry}
              onClose={() => setIsEditOpen(false)}
              onSaved={onSaved}
              onDeleted={onDeleted}
              readOnly={readOnly}
              showPartnerIdentity={!publicView}
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

function BeltIndicator({
  partner,
  compact = false,
}: {
  partner?: Partner;
  compact?: boolean;
}) {
  const belt = partner?.belt ?? "unknown";

  if (compact) {
    return (
      <span
        aria-label={partner ? `${formatBelt(belt)} belt` : "No belt collected"}
        className="inline-flex min-w-0 items-center"
      >
        <BeltMarker belt={belt} />
      </span>
    );
  }

  return (
    <span className="inline-flex min-w-0 items-center gap-2 text-sm font-medium text-zinc-900">
      <BeltMarker belt={belt} />
      <span className="truncate">
        {partner ? `${formatBelt(belt)} belt` : "Not collected"}
      </span>
    </span>
  );
}

function PartnerCell({ partner }: { partner?: Partner }) {
  if (!partner) {
    return <span className="text-sm text-zinc-500">No partner</span>;
  }

  const label = [partner.firstName, partner.lastName].filter(Boolean).join(" ");

  const content = (
    <>
      <span
        className={cx(
          "inline-flex shrink-0 rounded-full border-2",
          beltBorderStyles[partner.belt ?? "unknown"],
        )}
      >
        <Avatar
          initials={initialsForPartner(partner)}
          src={partner.profilePhoto}
          size="xs"
        />
      </span>
      <span className="truncate text-sm font-medium text-zinc-900">
        {label || "Unknown Partner"}
      </span>
    </>
  );

  return partner.accountId ? (
    <Link
      className="flex min-w-0 items-center gap-2 rounded-md hover:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      href={`/profiles/${encodeURIComponent(partner.accountId)}`}
    >
      {content}
    </Link>
  ) : (
    <span className="flex min-w-0 items-center gap-2">{content}</span>
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

  const avatar = (
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
      <Avatar
        initials={initialsForPartner(partner)}
        src={partner.profilePhoto}
        size="xs"
      />
    </span>
  );

  return partner.accountId ? (
    <Link
      aria-label={`View ${
        [partner.firstName, partner.lastName].filter(Boolean).join(" ") ||
        "training partner"
      } profile`}
      className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      href={`/profiles/${encodeURIComponent(partner.accountId)}`}
    >
      {avatar}
    </Link>
  ) : (
    avatar
  );
}
