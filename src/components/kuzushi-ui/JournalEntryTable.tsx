"use client";

import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { JournalEntryCreate } from "./JournalEntryCreate";
import { JournalEntryFilters } from "./JournalEntryFilters";
import { JournalEntryHeading } from "./JournalEntryHeading";
import { JournalEntryPagination } from "./JournalEntryPagination";
import { JournalEntryRow } from "./JournalEntryRow";
import {
  sampleEntries,
  type Category,
  type JournalEntry,
  type JournalType,
} from "./shared";

export function JournalEntryTable({
  entries = sampleEntries,
}: {
  entries?: JournalEntry[];
}) {
  const [query, setQuery] = useState("");
  const [tableEntries, setTableEntries] = useState(entries);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<JournalType[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const filteredEntries = useMemo(
    () =>
      tableEntries.filter(
        (entry) =>
          matchesQuery(entry, query) &&
          matchesCategory(entry, selectedCategories) &&
          matchesJournalType(entry, selectedTypes),
      ),
    [tableEntries, query, selectedCategories, selectedTypes],
  );

  return (
    <section className="grid gap-3">
      <JournalEntryFilters
        query={query}
        selectedCategories={selectedCategories}
        selectedTypes={selectedTypes}
        onQueryChange={setQuery}
        onCategoriesChange={setSelectedCategories}
        onTypesChange={setSelectedTypes}
        onAddEntry={() => setIsCreateOpen(true)}
      />
      <div className="overflow-x-auto rounded-lg border border-zinc-200">
        <table className="w-full min-w-[1048px] table-fixed border-collapse">
          <colgroup>
            <col className="w-[140px]" />
            <col className="w-[340px]" />
            <col className="w-[120px]" />
            <col className="w-[220px]" />
            <col className="w-[180px]" />
            <col className="w-12" />
          </colgroup>
          <JournalEntryHeading />
          <tbody>
            {filteredEntries.map((entry) => (
              <JournalEntryRow
                key={entry.id}
                entry={entry}
                onChange={(nextEntry) =>
                  setTableEntries((current) =>
                    current.map((item) =>
                      item.id === nextEntry.id ? nextEntry : item,
                    ),
                  )
                }
                onDelete={() =>
                  setTableEntries((current) =>
                    current.filter((item) => item.id !== entry.id),
                  )
                }
              />
            ))}
            {filteredEntries.length === 0 ? (
              <tr>
                <td
                  className="px-3 py-10 text-center text-sm text-zinc-500"
                  colSpan={6}
                >
                  No journal entries found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
        <JournalEntryPagination />
      </div>
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent
          className="max-h-[calc(100vh-2rem)] max-w-2xl overflow-y-auto bg-transparent p-0 ring-0 sm:max-w-2xl"
          showCloseButton={false}
        >
          <DialogDescription className="sr-only">
            Add a journal entry with technique, partner, and training details.
          </DialogDescription>
          <JournalEntryCreate
            onClose={() => setIsCreateOpen(false)}
            withinDialog
          />
        </DialogContent>
      </Dialog>
    </section>
  );
}

function matchesQuery(entry: JournalEntry, query: string) {
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) return true;

  const partnerName = entry.partner
    ? `${entry.partner.firstName} ${entry.partner.lastName}`
    : "";

  return [
    entry.technique,
    entry.setup ?? "",
    entry.category,
    entry.journalType ?? "",
    partnerName,
    entry.trainedDate,
  ].some((value) => normalize(value).includes(normalizedQuery));
}

function matchesCategory(entry: JournalEntry, categories: Category[]) {
  return categories.length === 0 || categories.includes(entry.category);
}

function matchesJournalType(entry: JournalEntry, types: JournalType[]) {
  if (types.length === 0) return true;
  if (entry.journalType === undefined) return false;

  return types.includes(entry.journalType);
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}
