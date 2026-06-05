"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { ButtonPrimary } from "./ButtonPrimary";
import { DonationBanner } from "./DonationBanner";
import { JournalEntryCreate } from "./JournalEntryCreate";
import { MyProfile } from "./MyProfile";
import { PublicProfileSearch } from "./PublicProfileSearch";
import { TrainingPartnersListModal } from "./TrainingPartnersListModal";
import { UserSummary } from "./UserSummary";

export function SidePanel() {
  const [isMyProfileOpen, setIsMyProfileOpen] = useState(false);
  const [isJournalEntryCreateOpen, setIsJournalEntryCreateOpen] =
    useState(false);
  const [isTrainingPartnersOpen, setIsTrainingPartnersOpen] = useState(false);

  const navItems = [
    {
      label: "Training partners",
      onClick: () => setIsTrainingPartnersOpen(true),
    },
    { label: "Saved Techniques" },
    { label: "Privacy Settings" },
    { label: "Contact Us" },
  ];

  return (
    <aside className="flex h-full min-h-180 w-full max-w-xs flex-col border-r border-zinc-200 bg-white p-4">
      <button
        type="button"
        className="w-full rounded-md text-left transition hover:bg-zinc-50 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        onClick={() => setIsMyProfileOpen(true)}
      >
        <UserSummary className="rounded-md p-2" />
      </button>
      <div className="mt-4">
        <PublicProfileSearch />
      </div>
      <div className="mt-4">
        <ButtonPrimary
          className="w-full"
          onClick={() => setIsJournalEntryCreateOpen(true)}
        >
          <Plus className="size-4" />
          New entry
        </ButtonPrimary>
      </div>
      <nav className="mt-4 grid gap-2 text-sm font-semibold text-zinc-800">
        {navItems.map((item) => (
          <button
            key={item.label}
            className="rounded-md px-3 py-2 text-left transition hover:bg-zinc-50 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            onClick={item.onClick}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </nav>
      <div className="mt-auto grid gap-3">
        <DonationBanner />
      </div>
      <Dialog open={isMyProfileOpen} onOpenChange={setIsMyProfileOpen}>
        <DialogContent
          className="max-w-2xl bg-transparent p-0 ring-0 sm:max-w-2xl"
          showCloseButton={false}
        >
          <DialogDescription className="sr-only">
            View and update your profile details.
          </DialogDescription>
          <MyProfile onClose={() => setIsMyProfileOpen(false)} withinDialog />
        </DialogContent>
      </Dialog>
      <Dialog
        open={isJournalEntryCreateOpen}
        onOpenChange={setIsJournalEntryCreateOpen}
      >
        <DialogContent
          className="max-h-[calc(100vh-2rem)] max-w-2xl overflow-y-auto bg-transparent p-0 ring-0 sm:max-w-2xl"
          showCloseButton={false}
        >
          <DialogDescription className="sr-only">
            Add a journal entry with technique, partner, and training details.
          </DialogDescription>
          <JournalEntryCreate
            onClose={() => setIsJournalEntryCreateOpen(false)}
            withinDialog
          />
        </DialogContent>
      </Dialog>
      <Dialog
        open={isTrainingPartnersOpen}
        onOpenChange={setIsTrainingPartnersOpen}
      >
        <DialogContent
          className="max-w-2xl bg-transparent p-0 ring-0 sm:max-w-2xl"
          showCloseButton={false}
        >
          <DialogDescription className="sr-only">
            Search, review, and manage your training partners.
          </DialogDescription>
          <TrainingPartnersListModal
            onClose={() => setIsTrainingPartnersOpen(false)}
            withinDialog
          />
        </DialogContent>
      </Dialog>
    </aside>
  );
}
