import { AlertBanner } from "./AlertBanner";
import { IconButton } from "./IconButton";

export function Header() {
  return (
    <header className="grid gap-3 border-b border-zinc-200 bg-transparent p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold uppercase text-zinc-900">Kuzushi Cafe</span>
        <IconButton label="Open notifications" icon="!" />
      </div>
      <AlertBanner />
    </header>
  );
}
