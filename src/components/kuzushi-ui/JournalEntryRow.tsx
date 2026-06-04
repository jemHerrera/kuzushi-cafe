import { IconButton } from "./IconButton";
import { TechniqueCategoryPill } from "./TechniqueCategoryPill";
import { UserSummary } from "./UserSummary";
import type { JournalEntry } from "./shared";

export function JournalEntryRow({ entry }: { entry: JournalEntry }) {
  return (
    <tr className="border-t border-zinc-200 bg-white">
      <td className="whitespace-nowrap px-3 py-3">
        <TechniqueCategoryPill category={entry.category} />
      </td>
      <td className="min-w-56 px-3 py-3">
        <p className="text-sm font-semibold text-zinc-950">{entry.technique}</p>
        {entry.setup ? <p className="text-xs text-zinc-500">{entry.setup}</p> : null}
      </td>
      <td className="whitespace-nowrap px-3 py-3 text-sm text-zinc-700">
        {entry.category === "tap" ? "Not collected" : entry.successful ? "Yes" : "No"}
      </td>
      <td className="whitespace-nowrap px-3 py-3">
        {entry.partner ? <UserSummary partner={entry.partner} /> : <span className="text-sm text-zinc-500">No partner</span>}
      </td>
      <td className="whitespace-nowrap px-3 py-3 text-sm text-zinc-700">{entry.trainedDate}</td>
      <td className="whitespace-nowrap px-3 py-3">
        <div className="flex gap-2">
          <IconButton label="Edit entry" icon="edit" />
          <IconButton label="Delete entry" icon="x" />
        </div>
      </td>
    </tr>
  );
}
