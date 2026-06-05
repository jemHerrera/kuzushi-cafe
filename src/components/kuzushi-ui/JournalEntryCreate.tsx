import { JournalEntryForm } from "./JournalEntryForm";

export function JournalEntryCreate({
  onClose,
  withinDialog = false,
}: {
  onClose?: () => void;
  withinDialog?: boolean;
}) {
  return (
    <JournalEntryForm
      mode="create"
      onClose={onClose}
      withinDialog={withinDialog}
    />
  );
}
