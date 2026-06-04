import { ButtonSecondary } from "./ButtonSecondary";

export function JournalEntryPagination() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 bg-white p-3 text-sm text-zinc-600">
      <span>Page 1 of 4</span>
      <div className="flex gap-2">
        <ButtonSecondary>Previous</ButtonSecondary>
        <ButtonSecondary>Next</ButtonSecondary>
      </div>
    </div>
  );
}
