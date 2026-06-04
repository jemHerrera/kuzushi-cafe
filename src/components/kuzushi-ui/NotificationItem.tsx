import { Check } from "lucide-react";
import { IconButton } from "./IconButton";

export function NotificationItem({
  heading = "Training partner request",
  body = "Maya Chen wants to connect as a training partner.",
  link = "View profile",
}: {
  heading?: string;
  body?: string;
  link?: string;
}) {
  return (
    <article className="rounded-md border border-zinc-200 bg-white p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-sm font-semibold text-zinc-950">{heading}</h4>
          <p className="mt-1 text-sm text-zinc-600">{body}</p>
          <a className="mt-2 inline-block text-sm font-semibold text-zinc-950" href="#">
            {link}
          </a>
        </div>
        <IconButton label="Mark as read" icon={<Check className="size-4" />} />
      </div>
    </article>
  );
}
