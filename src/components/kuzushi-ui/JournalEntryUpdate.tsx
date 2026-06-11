import { JournalEntryForm } from "./JournalEntryForm";
import type { JournalEntry } from "./shared";

export function JournalEntryUpdate({
  entry,
  onClose,
  onSaved,
  onDeleted,
  withinDialog = false,
}: {
  entry: JournalEntry;
  onClose?: () => void;
  onSaved?: () => void;
  onDeleted?: () => void;
  withinDialog?: boolean;
}) {
  return (
    <JournalEntryForm
      mode="update"
      entry={entry}
      onClose={onClose}
      onSaved={onSaved}
      onDeleted={onDeleted}
      withinDialog={withinDialog}
    />
  );
}
