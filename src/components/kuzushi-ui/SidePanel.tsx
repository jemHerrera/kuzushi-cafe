"use client";

import {
  BookOpenText,
  LockKeyhole,
  Plus,
  Settings,
  UserRound,
  UsersRound,
} from "lucide-react";

import type { AccountDetail } from "@/lib/managers/types";
import type { PublicAccountSummary } from "@/lib/managers/types";
import { cn } from "@/lib/utils";
import { BrandWordmark } from "./BrandWordmark";
import { ButtonPrimary } from "./ButtonPrimary";
import { DonationBanner } from "./DonationBanner";
import { PublicProfileSearch } from "./PublicProfileSearch";
import { SignOutButton } from "./SignOutButton";
import { UserSummary } from "./UserSummary";

type SidePanelAction =
  | "profile"
  | "new-entry"
  | "training-partners"
  | "saved-techniques"
  | "settings"
  | "donation";

export function SidePanel({
  account,
  className,
  onAction,
  onSelectProfile,
}: {
  account: AccountDetail;
  className?: string;
  onAction: (action: SidePanelAction) => void;
  onSelectProfile?: (profile: PublicAccountSummary) => void;
}) {
  const navItems = [
    {
      label: "Training partners",
      icon: UsersRound,
      action: "training-partners" as const,
    },
    {
      label: "Saved techniques",
      icon: BookOpenText,
      action: "saved-techniques" as const,
    },
    {
      label: "Privacy settings",
      icon: LockKeyhole,
      action: "settings" as const,
    },
  ];

  return (
    <aside
      className={cn(
        "flex h-full min-h-0 w-full max-w-xs flex-col overflow-y-auto border-r border-zinc-200 bg-white p-4",
        className,
      )}
    >
      <BrandWordmark href="/app" />
      <button
        type="button"
        className="mt-5 w-full rounded-md text-left transition hover:bg-zinc-50 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        onClick={() => onAction("profile")}
      >
        <UserSummary
          className="rounded-md p-2"
          identity={{
            firstName: account.firstName,
            lastName: account.lastName,
            belt: account.belt,
            profilePhoto: account.profilePhoto,
          }}
        />
      </button>
      <div className="mt-4">
        <PublicProfileSearch onSelectProfile={onSelectProfile} />
      </div>
      <div className="mt-4">
        <ButtonPrimary
          className="w-full"
          onClick={() => onAction("new-entry")}
          type="button"
        >
          <Plus className="size-4" />
          New entry
        </ButtonPrimary>
      </div>
      <nav
        aria-label="Workspace navigation"
        className="mt-4 grid gap-1 text-sm font-semibold text-zinc-800"
      >
        <button
          className="flex items-center gap-2 rounded-md bg-zinc-100 px-3 py-2 text-left text-zinc-950 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          type="button"
        >
          <UserRound className="size-4" />
          Journal
        </button>
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-left transition hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              onClick={() => onAction(item.action)}
              type="button"
            >
              <Icon className="size-4" />
              {item.label}
            </button>
          );
        })}
        <a
          className="flex items-center gap-2 rounded-md px-3 py-2 text-left transition hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          href="mailto:hello@kuzushi.cafe"
        >
          <Settings className="size-4" />
          Contact us
        </a>
      </nav>
      <div className="mt-auto grid gap-3 pt-6">
        <DonationBanner onDonate={() => onAction("donation")} />
        <SignOutButton />
      </div>
    </aside>
  );
}

export type { SidePanelAction };
