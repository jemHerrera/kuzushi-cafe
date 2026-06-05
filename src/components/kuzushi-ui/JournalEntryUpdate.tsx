import { JournalEntryForm } from "./JournalEntryForm";

export function JournalEntryUpdate({
  onClose,
  withinDialog = false,
}: {
  onClose?: () => void;
  withinDialog?: boolean;
}) {
  return (
    <JournalEntryForm
      mode="update"
      onClose={onClose}
      withinDialog={withinDialog}
    />
  );
}
