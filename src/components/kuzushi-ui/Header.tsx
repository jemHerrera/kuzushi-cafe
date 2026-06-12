import { Bell, Menu } from "lucide-react";
import type { PublicAccountSummary } from "@/lib/managers/types";
import { AlertBanner } from "./AlertBanner";
import { BrandWordmark } from "./BrandWordmark";
import { IconButton } from "./IconButton";
import { PublicProfileSearch } from "./PublicProfileSearch";

export function Header({
  alertMessage,
  onMenuOpen,
  onNotificationsOpen,
  onSelectProfile,
}: {
  alertMessage?: string;
  onMenuOpen?: () => void;
  onNotificationsOpen?: () => void;
  onSelectProfile?: (profile: PublicAccountSummary) => void;
}) {
  return (
    <header className="grid gap-3 border-b border-zinc-200 bg-white/90 p-4 backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <IconButton
            className="lg:hidden"
            label="Open navigation"
            icon={<Menu className="size-4" />}
            onClick={onMenuOpen}
          />
          <span className="lg:hidden">
            <BrandWordmark href="/app" />
          </span>
          <div className="w-11 shrink-0 sm:w-64">
            <PublicProfileSearch onSelectProfile={onSelectProfile} />
          </div>
          {alertMessage ? (
            <AlertBanner
              className="hidden grow sm:block"
              message={alertMessage}
            />
          ) : (
            <h1 className="hidden text-lg font-black text-zinc-950 sm:block">
              {/* Training journal */}
            </h1>
          )}
        </div>
        <IconButton
          label="Open notifications"
          icon={<Bell className="size-4" />}
          onClick={onNotificationsOpen}
        />
      </div>
      {alertMessage ? (
        <AlertBanner className="sm:hidden" message={alertMessage} />
      ) : null}
    </header>
  );
}
