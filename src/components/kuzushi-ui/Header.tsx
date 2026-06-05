import { Bell } from "lucide-react";
import { AlertBanner } from "./AlertBanner";
import { IconButton } from "./IconButton";

export function Header() {
  return (
    <header className="grid gap-3 border-b border-zinc-200 bg-transparent p-4">
      <div className="flex items-center justify-between gap-4">
        <AlertBanner className="grow" />
        <IconButton
          label="Open notifications"
          icon={<Bell className="size-4" />}
        />
      </div>
    </header>
  );
}
