"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import type { AccountDetail } from "@/lib/managers/types";
import type { PublicAccountSummary } from "@/lib/managers/types";
import { AggregateOverview } from "./AggregateOverview";
import { DonationModal } from "./DonationModal";
import { Header } from "./Header";
import { JournalEntryTable } from "./JournalEntryTable";
import { JournalEntryCreate } from "./JournalEntryCreate";
import { MyProfile } from "./MyProfile";
import { NotificationList } from "./NotificationList";
import { PrivacySettings } from "./PrivacySettings";
import { PublicProfile } from "./PublicProfile";
import { SavedTechniqueTagList } from "./SavedTechniqueTagList";
import { SidePanel, type SidePanelAction } from "./SidePanel";
import { TrainingPartnersListModal } from "./TrainingPartnersListModal";

type ShellModal =
  | Exclude<
      SidePanelAction,
      "profile" | "saved-techniques" | "training-partners"
    >
  | "profile"
  | "public-profile";

const modalDescriptions: Record<ShellModal, string> = {
  profile: "View and update your profile details.",
  "new-entry":
    "Add a journal entry with technique, partner, and training details.",
  settings: "Choose who can view your profile and journal activity.",
  donation: "Choose a donation amount to support Kuzushi Cafe.",
  "public-profile": "View a public profile and manage relationship state.",
};

export function AppShell({ account }: { account: AccountDetail }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentAccount, setCurrentAccount] = useState(account);
  const [activeModal, setActiveModal] = useState<ShellModal | null>(null);
  const [journalRefreshToken, setJournalRefreshToken] = useState(0);
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSavedTechniquesOpen, setIsSavedTechniquesOpen] = useState(false);
  const [isTrainingPartnersOpen, setIsTrainingPartnersOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] =
    useState<PublicAccountSummary | null>(null);
  const profileAccountId = searchParams.get("profile")?.trim() || undefined;
  const donationReturn = searchParams.get("donation");
  const donationReturnState =
    donationReturn === "success" || donationReturn === "canceled"
      ? donationReturn
      : undefined;
  const donationSessionId = searchParams.get("session_id")?.trim() || undefined;
  const displayedModal = profileAccountId
    ? "public-profile"
    : donationReturnState
      ? "donation"
      : activeModal;

  function openModal(action: SidePanelAction) {
    setIsNavigationOpen(false);
    if (action === "saved-techniques") {
      setIsSavedTechniquesOpen(true);
      return;
    }
    if (action === "training-partners") {
      setIsTrainingPartnersOpen(true);
      return;
    }
    setActiveModal(action);
  }

  function closeModal() {
    if (profileAccountId || donationReturnState) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("profile");
      params.delete("donation");
      params.delete("session_id");
      router.replace(`${pathname}${params.size ? `?${params}` : ""}`, {
        scroll: false,
      });
    }
    setActiveModal(null);
    setSelectedProfile(null);
  }

  function openPublicProfile(profile: PublicAccountSummary) {
    setIsNavigationOpen(false);
    setSelectedProfile(profile);
    openPublicProfileById(profile.id);
  }

  function openPublicProfileById(accountId: string) {
    setIsNavigationOpen(false);
    setIsNotificationsOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    params.set("profile", accountId);
    router.push(`${pathname}?${params}`, { scroll: false });
  }

  return (
    <main className="min-h-screen bg-stone-50 text-zinc-950">
      <div className="grid min-h-screen lg:grid-cols-[20rem_minmax(0,1fr)]">
        <SidePanel
          account={currentAccount}
          className="fixed inset-y-0 left-0 hidden lg:flex"
          onAction={openModal}
        />
        <div className="min-w-0 lg:col-start-2">
          <div className="sticky top-0 z-30">
            <Header
              onMenuOpen={() => setIsNavigationOpen(true)}
              onNotificationsOpen={() => setIsNotificationsOpen(true)}
              onSelectProfile={openPublicProfile}
            />
          </div>
          <section className="mx-auto grid w-full max-w-7xl gap-6 p-4 sm:p-6 lg:p-8">
            <div>
              <h2 className="mt-1 text-3xl font-black tracking-tight">
                Welcome back, {currentAccount.firstName}
              </h2>
            </div>
            <JournalEntryTable
              onEntriesChange={() =>
                setJournalRefreshToken((token) => token + 1)
              }
              refreshToken={journalRefreshToken}
            />
            <AggregateOverview
              onAddEntry={() => setActiveModal("new-entry")}
              refreshToken={journalRefreshToken}
            />
          </section>
        </div>
      </div>

      <Sheet open={isNavigationOpen} onOpenChange={setIsNavigationOpen}>
        <SheetContent
          className="w-[min(22rem,calc(100vw-2rem))] p-0"
          side="left"
        >
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SheetDescription className="sr-only">
            Open profile, journal, saved techniques, settings, and donation
            actions.
          </SheetDescription>
          <SidePanel
            account={currentAccount}
            className="max-w-none border-r-0"
            onAction={openModal}
          />
        </SheetContent>
      </Sheet>

      <Sheet open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
        <SheetContent className="w-full p-0 sm:max-w-md" side="right">
          <SheetTitle className="sr-only">Notifications</SheetTitle>
          <SheetDescription className="sr-only">
            Review recent Kuzushi Cafe notifications.
          </SheetDescription>
          <NotificationList
            className="h-full max-w-none border-l-0 pt-14"
            onOpenProfile={openPublicProfileById}
          />
        </SheetContent>
      </Sheet>

      <Sheet
        open={isSavedTechniquesOpen}
        onOpenChange={setIsSavedTechniquesOpen}
      >
        <SheetContent
          className="w-full p-0 sm:max-w-md"
          side="left"
          showCloseButton={false}
        >
          <SheetTitle className="sr-only">Saved techniques</SheetTitle>
          <SheetDescription className="sr-only">
            Search, add, edit, and delete your saved techniques.
          </SheetDescription>
          <SavedTechniqueTagList
            className="h-full"
            onClose={() => setIsSavedTechniquesOpen(false)}
            presentation="sheet"
          />
        </SheetContent>
      </Sheet>

      <Sheet
        open={isTrainingPartnersOpen}
        onOpenChange={setIsTrainingPartnersOpen}
      >
        <SheetContent
          className="w-full p-0 sm:max-w-md"
          side="left"
          showCloseButton={false}
        >
          <SheetTitle className="sr-only">Training partners</SheetTitle>
          <SheetDescription className="sr-only">
            Search, review, and manage your training partners.
          </SheetDescription>
          <TrainingPartnersListModal
            onClose={() => setIsTrainingPartnersOpen(false)}
            onSelectPartner={(profile) => {
              setIsTrainingPartnersOpen(false);
              openPublicProfile(profile);
            }}
            presentation="sheet"
          />
        </SheetContent>
      </Sheet>

      <Dialog
        open={displayedModal !== null}
        onOpenChange={(open) => {
          if (!open) closeModal();
        }}
      >
        <DialogContent
          className="max-h-[calc(100vh-2rem)] max-w-2xl overflow-y-auto bg-transparent p-0 ring-0 sm:max-w-2xl"
          showCloseButton={false}
        >
          <DialogDescription className="sr-only">
            {displayedModal ? modalDescriptions[displayedModal] : ""}
          </DialogDescription>
          {displayedModal === "profile" ? (
            <MyProfile
              initialProfile={{
                firstName: currentAccount.firstName ?? "",
                lastName: currentAccount.lastName ?? "",
                belt: currentAccount.belt,
                weight: currentAccount.weight,
                birthday: currentAccount.birthday
                  ? new Date(currentAccount.birthday)
                  : undefined,
                bio: currentAccount.bio ?? "",
              }}
              onSaved={setCurrentAccount}
              onClose={closeModal}
              profilePhoto={currentAccount.profilePhoto}
              withinDialog
            />
          ) : null}
          {displayedModal === "new-entry" ? (
            <JournalEntryCreate
              onClose={closeModal}
              onSaved={() => setJournalRefreshToken((token) => token + 1)}
              withinDialog
            />
          ) : null}
          {displayedModal === "settings" ? (
            <PrivacySettings onClose={closeModal} withinDialog />
          ) : null}
          {displayedModal === "donation" ? (
            <DonationModal
              onClose={closeModal}
              returnState={donationReturnState}
              sessionId={donationSessionId}
              withinDialog
            />
          ) : null}
          {displayedModal === "public-profile" && profileAccountId ? (
            <PublicProfile
              key={profileAccountId}
              accountId={profileAccountId}
              initialProfile={
                selectedProfile?.id === profileAccountId
                  ? selectedProfile
                  : undefined
              }
              onClose={closeModal}
              onRelationshipChange={() => undefined}
              withinDialog
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </main>
  );
}
