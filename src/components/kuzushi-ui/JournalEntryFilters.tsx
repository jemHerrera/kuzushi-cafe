import { ButtonPrimary } from "./ButtonPrimary";
import { JournalEntrySearch } from "./JournalEntrySearch";
import { SelectInput } from "./shared";

export function JournalEntryFilters() {
  return (
    <div className="grid gap-3 rounded-lg border border-zinc-200 bg-white p-3 lg:grid-cols-[1fr_auto_auto_auto_auto]">
      <JournalEntrySearch />
      <SelectInput>
        <option>All categories</option>
      </SelectInput>
      <SelectInput>
        <option>All attempts</option>
        <option>Successful only</option>
      </SelectInput>
      <SelectInput>
        <option>Gi and No-Gi</option>
      </SelectInput>
      <ButtonPrimary>Add entry</ButtonPrimary>
    </div>
  );
}
