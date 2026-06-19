import { JournalEntryForm } from "./JournalEntryForm";
import type { JournalEntry } from "./shared";

export function JournalEntryUpdate({
  entry,
  onClose,
  onSaved,
  onDeleted,
  withinDialog = false,
  readOnly = false,
  showPartnerIdentity = true,
}: {
  entry: JournalEntry;
  onClose?: () => void;
  onSaved?: () => void;
  onDeleted?: () => void;
  withinDialog?: boolean;
  readOnly?: boolean;
  showPartnerIdentity?: boolean;
}) {
  return (
    <JournalEntryForm
      mode="update"
      entry={entry}
      onClose={onClose}
      onSaved={onSaved}
      onDeleted={onDeleted}
      withinDialog={withinDialog}
      readOnly={readOnly}
      showPartnerIdentity={showPartnerIdentity}
    />
  );
}
