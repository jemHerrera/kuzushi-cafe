import { Inbox, Plus, type LucideIcon } from "lucide-react";
import { ButtonPrimary } from "./ButtonPrimary";
import { cx } from "./shared";

export function EmptyState({
  className,
  title = "No journal entries",
  body = "Entries track training patterns. Add one to get started.",
  onAction,
  actionLabel = "Add journal entry",
  icon: Icon = Inbox,
}: {
  className?: string;
  title?: string;
  body?: string;
  onAction?: () => void;
  actionLabel?: string;
  icon?: LucideIcon;
}) {
  return (
    <div className={cx("rounded-lg bg-white p-6 text-center", className)}>
      <Icon className="mx-auto size-5 text-zinc-400" />
      <h3 className="text-base font-bold text-zinc-950">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-zinc-600">{body}</p>
      {onAction ? (
        <div className="mt-4">
          <ButtonPrimary onClick={onAction} type="button">
            <Plus className="size-4" />
            {actionLabel}
          </ButtonPrimary>
        </div>
      ) : null}
    </div>
  );
}
