"use client";

import {
  BookOpenText,
  House,
  LockKeyhole,
  Plus,
  Settings,
  UsersRound,
} from "lucide-react";
import Link from "next/link";

import type { AccountDetail } from "@/lib/managers/types";
import { cn } from "@/lib/utils";
import { BrandWordmark } from "./BrandWordmark";
import { ButtonPrimary } from "./ButtonPrimary";
import { DonationBanner } from "./DonationBanner";
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
  hasInboundTrainingPartnerRequests = false,
  onAction,
}: {
  account: AccountDetail;
  className?: string;
  hasInboundTrainingPartnerRequests?: boolean;
  onAction: (action: SidePanelAction) => void;
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
            donated: account.donated,
          }}
        />
      </button>
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
        <Link
          className="flex items-center gap-2 rounded-md px-3 py-2 text-left transition hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          href="/app"
        >
          <House className="size-4" />
          Home
        </Link>
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
              {item.action === "training-partners" &&
              hasInboundTrainingPartnerRequests ? (
                <span
                  aria-hidden="true"
                  className="ml-auto size-2 rounded-full bg-emerald-500"
                />
              ) : null}
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
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-zinc-500">
          <Link className="hover:text-zinc-950" href="/privacy-policy">
            Privacy
          </Link>
          <Link className="hover:text-zinc-950" href="/terms-of-service">
            Terms
          </Link>
          <SignOutButton />
        </div>
      </div>
    </aside>
  );
}

export type { SidePanelAction };
