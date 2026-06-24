import { Bell, Menu } from "lucide-react";
import type { PublicAccountSummary } from "@/lib/managers/types";
import { AlertBanner } from "./AlertBanner";
import { BrandWordmark } from "./BrandWordmark";
import { IconButton } from "./IconButton";
import { PublicProfileSearch } from "./PublicProfileSearch";

export function Header({
  alertMessage,
  hasUnreadNotifications = false,
  onMenuOpen,
  onNotificationsOpen,
  onProfileSearchOpenChange,
  onSelectProfile,
  isProfileSearchOpen,
}: {
  alertMessage?: string;
  hasUnreadNotifications?: boolean;
  isProfileSearchOpen?: boolean;
  onMenuOpen?: () => void;
  onNotificationsOpen?: () => void;
  onProfileSearchOpenChange?: (open: boolean) => void;
  onSelectProfile?: (profile: PublicAccountSummary) => void;
}) {
  return (
    <header className="grid gap-2 border-b border-zinc-200 bg-white/90 px-2 py-1 backdrop-blur sm:gap-3 sm:p-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center sm:hidden">
        <div className="justify-self-start">
          <IconButton
            label="Open navigation"
            icon={<Menu className="size-4" />}
            variant="ghost"
            onClick={onMenuOpen}
          />
        </div>
        <BrandWordmark href="/app" />
        <div className="flex items-center justify-self-end">
          <PublicProfileSearch
            open={isProfileSearchOpen}
            onOpenChange={onProfileSearchOpenChange}
            onSelectProfile={onSelectProfile}
            trigger="icon"
          />
          <IconButton
            className="relative"
            label="Open notifications"
            icon={
              <>
                <Bell className="size-4" />
                {hasUnreadNotifications ? <IndicatorDot /> : null}
              </>
            }
            variant="ghost"
            onClick={onNotificationsOpen}
          />
        </div>
      </div>
      <div className="hidden items-center justify-between gap-4 sm:flex">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <IconButton
            className="lg:hidden"
            label="Open navigation"
            icon={<Menu className="size-4" />}
            onClick={onMenuOpen}
          />
          <div className="w-64 shrink-0">
            <PublicProfileSearch
              open={isProfileSearchOpen}
              onOpenChange={onProfileSearchOpenChange}
              onSelectProfile={onSelectProfile}
            />
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
          className="relative"
          label="Open notifications"
          icon={
            <>
              <Bell className="size-4" />
              {hasUnreadNotifications ? <IndicatorDot /> : null}
            </>
          }
          onClick={onNotificationsOpen}
        />
      </div>
      {alertMessage ? (
        <AlertBanner className="sm:hidden" message={alertMessage} />
      ) : null}
    </header>
  );
}

function IndicatorDot() {
  return (
    <span
      aria-hidden="true"
      className="absolute right-1.5 top-1.5 size-2 rounded-full bg-emerald-500 ring-2 ring-white"
    />
  );
}
