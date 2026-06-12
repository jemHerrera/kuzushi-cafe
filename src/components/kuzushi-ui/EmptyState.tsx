import { Plus } from "lucide-react";
import { ButtonPrimary } from "./ButtonPrimary";

export function EmptyState({
  title = "No journal entries",
  body = "Entries track training patterns. Add one to get started.",
  onAction,
  actionLabel = "Add journal entry",
}: {
  title?: string;
  body?: string;
  onAction?: () => void;
  actionLabel?: string;
}) {
  return (
    <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-6 text-center">
      <h3 className="text-base font-bold text-zinc-950">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-zinc-600">{body}</p>
      <div className="mt-4">
        <ButtonPrimary onClick={onAction} type="button">
          <Plus className="size-4" />
          {actionLabel}
        </ButtonPrimary>
      </div>
    </div>
  );
}
