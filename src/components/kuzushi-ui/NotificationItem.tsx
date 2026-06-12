"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotificationItem({
  heading = "Training partner request",
  body = "A training partner sent you a notification.",
  unread = true,
  canOpen,
  disabled,
  onOpen,
  onMarkRead,
}: {
  heading?: string;
  body?: string;
  unread?: boolean;
  canOpen?: boolean;
  disabled?: boolean;
  onOpen?: () => void;
  onMarkRead?: () => void;
}) {
  return (
    <article className="flex items-start gap-2 rounded-md border border-zinc-200 bg-white p-3">
      <button
        aria-label={
          unread ? `${heading}. Unread. ${body}` : `${heading}. ${body}`
        }
        className="flex min-w-0 flex-1 items-start gap-3 text-left disabled:cursor-default"
        disabled={!canOpen || disabled}
        type="button"
        onClick={onOpen}
      >
        <span
          aria-label={unread ? "Unread notification" : "Read notification"}
          className={`mt-1.5 size-2 shrink-0 rounded-full ${unread ? "bg-emerald-500" : "bg-zinc-300"}`}
          title={unread ? "Unread" : "Read"}
        />
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-zinc-950">
            {heading}
          </span>
          <span className="mt-1 block text-sm text-zinc-600">{body}</span>
        </span>
      </button>
      {unread ? (
        <Button
          aria-label={`Mark ${heading} as read`}
          className="shrink-0 text-zinc-500"
          disabled={disabled}
          size="icon-sm"
          title="Mark as read"
          type="button"
          variant="ghost"
          onClick={onMarkRead}
        >
          <Check className="size-4" />
        </Button>
      ) : null}
    </article>
  );
}
