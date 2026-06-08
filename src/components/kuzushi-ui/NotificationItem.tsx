import type { MouseEventHandler } from "react";

export function NotificationItem({
  heading = "Training partner request",
  body = "Maya Chen wants to connect as a training partner.",
  href = "#",
  unread = true,
  onClick,
}: {
  heading?: string;
  body?: string;
  href?: string;
  unread?: boolean;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}) {
  return (
    <a
      aria-label={
        unread ? `${heading}. Unread. ${body}` : `${heading}. ${body}`
      }
      className="block rounded-md border border-zinc-200 bg-white p-3 transition-colors hover:border-zinc-300 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
      href={href}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <span
          aria-label={unread ? "Unread notification" : "Read notification"}
          className={`mt-1.5 size-2 shrink-0 rounded-full ${unread ? "bg-emerald-500" : "bg-zinc-300"}`}
          title={unread ? "Unread" : "Read"}
        />
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-zinc-950">{heading}</h4>
          <p className="mt-1 text-sm text-zinc-600">{body}</p>
        </div>
      </div>
    </a>
  );
}
