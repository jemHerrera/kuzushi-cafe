import { JournalEntryFilters } from "./JournalEntryFilters";
import { JournalEntryHeading } from "./JournalEntryHeading";
import { JournalEntryPagination } from "./JournalEntryPagination";
import { JournalEntryRow } from "./JournalEntryRow";
import { sampleEntries, type JournalEntry } from "./shared";

export function JournalEntryTable({ entries = sampleEntries }: { entries?: JournalEntry[] }) {
  return (
    <section className="grid gap-3">
      <JournalEntryFilters />
      <div className="overflow-x-auto rounded-lg border border-zinc-200">
        <table className="min-w-[860px] w-full border-collapse">
          <JournalEntryHeading />
          <tbody>
            {entries.map((entry) => (
              <JournalEntryRow key={entry.id} entry={entry} />
            ))}
          </tbody>
        </table>
        <JournalEntryPagination />
      </div>
    </section>
  );
}
