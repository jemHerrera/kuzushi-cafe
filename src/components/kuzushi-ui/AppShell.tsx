"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import type {
  AccountDetail,
  JournalEntryDetail,
  NotificationIndicators,
  PaginatedResponse,
  PublicAccountSummary,
} from "@/lib/managers/types";
import { Header } from "./Header";
import { JournalEntryTable } from "./JournalEntryTable";
import { PublicProfile } from "./PublicProfile";
import { SidePanel, type SidePanelAction } from "./SidePanel";
import { Stats } from "./Stats";
import { TrainingActivity } from "./TrainingActivity";

const DonationModal = dynamic(
  () => import("./DonationModal").then((module) => module.DonationModal),
  { loading: () => null },
);
const JournalEntryCreate = dynamic(
  () =>
    import("./JournalEntryCreate").then((module) => module.JournalEntryCreate),
  { loading: () => null },
);
const MyProfile = dynamic(
  () => import("./MyProfile").then((module) => module.MyProfile),
  { loading: () => null },
);
const NotificationList = dynamic(
  () =>
    import("./NotificationList").then((module) => module.NotificationList),
  { loading: () => null },
);
const PrivacySettings = dynamic(
  () =>
    import("./PrivacySettings").then((module) => module.PrivacySettings),
  { loading: () => null },
);
const SavedTechniqueTagList = dynamic(
  () =>
    import("./SavedTechniqueTagList").then(
      (module) => module.SavedTechniqueTagList,
    ),
  { loading: () => null },
);
const TrainingPartnersListModal = dynamic(
  () =>
    import("./TrainingPartnersListModal").then(
      (module) => module.TrainingPartnersListModal,
    ),
  { loading: () => null },
);

type ShellModal =
  | Exclude<
      SidePanelAction,
      "profile" | "saved-techniques" | "training-partners"
    >
  | "profile";

const modalDescriptions: Record<ShellModal, string> = {
  profile: "View and update your profile details.",
  "new-entry":
    "Add a journal entry with technique, partner, and training details.",
  settings: "Choose who can view your journal, activity, and stats.",
  donation: "Choose a donation amount to support Kuzushi Cafe.",
};

type AppShellProps = { account: AccountDetail } & (
  | {
      initialHasJournalEntries: boolean;
      initialJournal: PaginatedResponse<JournalEntryDetail>;
      initialJournalQueryKey: string;
      profileAccountId?: never;
    }
  | {
      initialHasJournalEntries?: never;
      initialJournal?: never;
      initialJournalQueryKey?: never;
      profileAccountId: string;
    }
);

export function AppShell(props: AppShellProps) {
  const { account } = props;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentAccount, setCurrentAccount] = useState(account);
  const [hasJournalEntries, setHasJournalEntries] = useState(
    props.profileAccountId === undefined
      ? props.initialHasJournalEntries
      : false,
  );
  const [activeModal, setActiveModal] = useState<ShellModal | null>(null);
  const [journalRefreshToken, setJournalRefreshToken] = useState(0);
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSavedTechniquesOpen, setIsSavedTechniquesOpen] = useState(false);
  const [isTrainingPartnersOpen, setIsTrainingPartnersOpen] = useState(false);
  const [indicators, setIndicators] = useState<NotificationIndicators>({
    hasUnreadNotifications: false,
    hasInboundTrainingPartnerRequests: false,
  });
  const donationReturn = searchParams.get("donation");
  const donationReturnState =
    donationReturn === "success" || donationReturn === "canceled"
      ? donationReturn
      : undefined;
  const donationSessionId = searchParams.get("session_id")?.trim() || undefined;
  const displayedModal = donationReturnState ? "donation" : activeModal;

  const refreshIndicators = useCallback(async () => {
    try {
      const response = await fetch("/api/notifications/indicators");
      if (!response.ok) return;
      setIndicators((await response.json()) as NotificationIndicators);
    } catch {
      // Indicators are supplemental and will retry on the next focus or action.
    }
  }, []);

  const refreshJournalPresence = useCallback(async () => {
    try {
      const response = await fetch("/api/journal-entries?limit=1");
      if (!response.ok) return;

      const data =
        (await response.json()) as PaginatedResponse<JournalEntryDetail>;
      setHasJournalEntries(data.items.length > 0);
    } catch {
      // Presence is only used to hide empty dashboard sections; keep the last known state.
    }
  }, []);

  function handleJournalEntriesChange(options?: { hasEntries?: boolean }) {
    setJournalRefreshToken((token) => token + 1);
    if (options?.hasEntries !== undefined) {
      setHasJournalEntries(options.hasEntries);
      return;
    }
    void refreshJournalPresence();
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void refreshIndicators();
    }, 0);

    function handleFocus() {
      void refreshIndicators();
    }

    window.addEventListener("focus", handleFocus);
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("focus", handleFocus);
    };
  }, [refreshIndicators]);

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
    if (donationReturnState) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("donation");
      params.delete("session_id");
      router.replace(`${pathname}${params.size ? `?${params}` : ""}`, {
        scroll: false,
      });
    }
    setActiveModal(null);
  }

  const handleDonationSuccess = useCallback(() => {
    setCurrentAccount((account) => ({ ...account, donated: true }));
  }, []);

  function openPublicProfile(profile: PublicAccountSummary) {
    openPublicProfileById(profile.id);
  }

  function openPublicProfileById(accountId: string) {
    setIsNavigationOpen(false);
    setIsNotificationsOpen(false);
    router.push(`/profiles/${encodeURIComponent(accountId)}`);
  }

  return (
    <main className="min-h-screen bg-stone-50 text-zinc-950">
      <div className="grid min-h-screen lg:grid-cols-[20rem_minmax(0,1fr)]">
        <SidePanel
          account={currentAccount}
          className="fixed inset-y-0 left-0 hidden lg:flex"
          hasInboundTrainingPartnerRequests={
            indicators.hasInboundTrainingPartnerRequests
          }
          onAction={openModal}
        />
        <div className="min-w-0 lg:col-start-2">
          <div className="sticky top-0 z-30">
            <Header
              hasUnreadNotifications={indicators.hasUnreadNotifications}
              onMenuOpen={() => setIsNavigationOpen(true)}
              onNotificationsOpen={() => setIsNotificationsOpen(true)}
              onSelectProfile={openPublicProfile}
            />
          </div>
          <section className="mx-auto grid w-full max-w-7xl gap-6 p-4 sm:p-6 lg:p-8">
            {props.profileAccountId !== undefined ? (
              <PublicProfile
                key={props.profileAccountId}
                accountId={props.profileAccountId}
                onClose={() => router.push("/app")}
                onRelationshipChange={() => void refreshIndicators()}
              />
            ) : (
              <>
                <div>
                  <h2 className="mt-1 text-xl font-black tracking-tight">
                    Home
                  </h2>
                </div>
                <JournalEntryTable
                  initialEntries={props.initialJournal.items}
                  initialQueryKey={props.initialJournalQueryKey}
                  onEntriesChange={handleJournalEntriesChange}
                  refreshToken={journalRefreshToken}
                />
                {hasJournalEntries ? (
                  <>
                    <TrainingActivity
                      onAddEntry={() => setActiveModal("new-entry")}
                      refreshToken={journalRefreshToken}
                    />
                    <Stats
                      onAddEntry={() => setActiveModal("new-entry")}
                      refreshToken={journalRefreshToken}
                    />
                  </>
                ) : null}
              </>
            )}
          </section>
        </div>
      </div>

      <Sheet open={isNavigationOpen} onOpenChange={setIsNavigationOpen}>
        <SheetContent
          className="p-0 data-[side=left]:w-full data-[side=left]:max-w-none data-[side=left]:sm:w-[min(24rem,calc(100vw-2rem))]"
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
            hasInboundTrainingPartnerRequests={
              indicators.hasInboundTrainingPartnerRequests
            }
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
            onIndicatorsChange={refreshIndicators}
            onOpenProfile={openPublicProfileById}
          />
        </SheetContent>
      </Sheet>

      <Sheet
        open={isSavedTechniquesOpen}
        onOpenChange={setIsSavedTechniquesOpen}
      >
        <SheetContent
          className="p-0 data-[side=left]:w-full data-[side=left]:max-w-none data-[side=left]:sm:w-[min(28rem,calc(100vw-2rem))]"
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
          className="p-0 data-[side=left]:w-full data-[side=left]:max-w-none data-[side=left]:sm:w-[min(28rem,calc(100vw-2rem))]"
          side="left"
          showCloseButton={false}
        >
          <SheetTitle className="sr-only">Training partners</SheetTitle>
          <SheetDescription className="sr-only">
            Search, review, and manage your training partners.
          </SheetDescription>
          <TrainingPartnersListModal
            hasInboundTrainingPartnerRequests={
              indicators.hasInboundTrainingPartnerRequests
            }
            onIndicatorsChange={refreshIndicators}
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
          className="h-dvh max-h-dvh max-w-none overflow-y-auto bg-transparent p-0 ring-0 sm:h-auto sm:max-h-[calc(100vh-2rem)] sm:max-w-2xl"
          showCloseButton={false}
        >
          <DialogTitle className="sr-only">
            {displayedModal
              ? {
                  profile: "Profile",
                  "new-entry": "New journal entry",
                  settings: "Privacy settings",
                  donation: "Donation",
                }[displayedModal]
              : "Dialog"}
          </DialogTitle>
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
              donated={currentAccount.donated}
              onClose={closeModal}
              profilePhoto={currentAccount.profilePhoto}
              withinDialog
            />
          ) : null}
          {displayedModal === "new-entry" ? (
            <JournalEntryCreate
              onClose={closeModal}
              onSaved={() => handleJournalEntriesChange({ hasEntries: true })}
              withinDialog
            />
          ) : null}
          {displayedModal === "settings" ? (
            <PrivacySettings onClose={closeModal} withinDialog />
          ) : null}
          {displayedModal === "donation" ? (
            <DonationModal
              onClose={closeModal}
              onSuccess={handleDonationSuccess}
              returnState={donationReturnState}
              sessionId={donationSessionId}
              withinDialog
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </main>
  );
}
