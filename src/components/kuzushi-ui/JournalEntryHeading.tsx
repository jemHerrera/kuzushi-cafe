"use client";

import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { JournalEntrySort } from "@/lib/managers/types";

type SortField = JournalEntrySort["field"];

const headings: Array<{ label: string; field: SortField }> = [
  { label: "Category", field: "category" },
  { label: "Technique", field: "name" },
  { label: "Type", field: "journalType" },
  { label: "Training partner", field: "trainingPartner" },
  { label: "Trained date", field: "trainedAt" },
];

export function JournalEntryHeading({
  readOnly = false,
  sort,
  onSortChange,
}: {
  readOnly?: boolean;
  sort?: JournalEntrySort;
  onSortChange?: (sort: JournalEntrySort) => void;
} = {}) {
  return (
    <thead className="bg-zinc-100 text-left text-xs uppercase text-zinc-600 max-md:hidden">
      <tr>
        {headings.map((heading) => (
          <th key={heading.field} className="whitespace-nowrap px-2 py-2">
            <SortButton
              heading={heading}
              sort={sort}
              onSortChange={onSortChange}
            />
          </th>
        ))}
        {!readOnly ? (
          <th className="w-10 px-1 py-3">
            <span className="sr-only">Entry actions</span>
          </th>
        ) : null}
      </tr>
    </thead>
  );
}

function SortButton({
  heading,
  sort,
  onSortChange,
}: {
  heading: { label: string; field: SortField };
  sort?: JournalEntrySort;
  onSortChange?: (sort: JournalEntrySort) => void;
}) {
  const isActive = sort?.field === heading.field;
  const direction = isActive ? sort.direction : undefined;
  const Icon =
    direction === "asc"
      ? ArrowUp
      : direction === "desc"
        ? ArrowDown
        : ChevronsUpDown;

  return (
    <Button
      className="-ml-2 h-8 gap-1 px-2 text-xs font-bold uppercase text-zinc-600 hover:text-zinc-950"
      type="button"
      variant="ghost"
      onClick={() => {
        if (!onSortChange) return;
        const nextDirection =
          isActive && sort.direction === "asc"
            ? "desc"
            : isActive
              ? "asc"
              : heading.field === "trainedAt"
                ? "desc"
                : "asc";
        onSortChange({ field: heading.field, direction: nextDirection });
      }}
    >
      {heading.label}
      <Icon className="size-3.5" />
    </Button>
  );
}
