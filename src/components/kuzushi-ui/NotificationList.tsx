import { CheckCheck } from "lucide-react";
import { NotificationItem } from "./NotificationItem";

export function NotificationList() {
  return (
    <aside className="grid max-w-sm gap-3 border-l border-zinc-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-zinc-950">Notifications</h3>
        <button className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-700">
          <CheckCheck className="size-4" />
          Mark all as read
        </button>
      </div>
      <NotificationItem />
      <NotificationItem
        heading="Saved technique updated"
        body="Knee cut pass was added to public techniques."
        unread={false}
      />
    </aside>
  );
}
