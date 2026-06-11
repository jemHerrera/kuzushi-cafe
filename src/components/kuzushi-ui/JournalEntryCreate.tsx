import { JournalEntryForm } from "./JournalEntryForm";

export function JournalEntryCreate({
  onClose,
  onSaved,
  withinDialog = false,
}: {
  onClose?: () => void;
  onSaved?: () => void;
  withinDialog?: boolean;
}) {
  return (
    <JournalEntryForm
      mode="create"
      onClose={onClose}
      onSaved={onSaved}
      withinDialog={withinDialog}
    />
  );
}
