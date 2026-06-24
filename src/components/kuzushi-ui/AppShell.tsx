"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";

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
import { UserSummary } from "./UserSummary";
import { useCurrentSearch, writeBrowserUrl } from "./urlState";

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
  () => import("./NotificationList").then((module) => module.NotificationList),
  { loading: () => null },
);
const PrivacySettings = dynamic(
  () => import("./PrivacySettings").then((module) => module.PrivacySettings),
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
  | "profile"
  | "profile-search";

type ShellPanel =
  | "navigation"
  | "notifications"
  | "saved-techniques"
  | "training-partners";

const shellPanels = new Set<string>([
  "navigation",
  "notifications",
  "saved-techniques",
  "training-partners",
]);
const shellModals = new Set<string>([
  "profile",
  "profile-search",
  "new-entry",
  "settings",
  "donation",
]);

const modalDescriptions: Record<ShellModal, string> = {
  profile: "View and update your profile details.",
  "profile-search": "Search public profiles.",
  "new-entry": "Add an entry with technique, partner, and training details.",
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
  const currentSearch = useCurrentSearch();
  const currentSearchParams = useMemo(
    () => new URLSearchParams(currentSearch),
    [currentSearch],
  );
  const [currentAccount, setCurrentAccount] = useState(account);
  const [hasJournalEntries, setHasJournalEntries] = useState(
    props.profileAccountId === undefined
      ? props.initialHasJournalEntries
      : false,
  );
  const [journalRefreshToken, setJournalRefreshToken] = useState(0);
  const [indicators, setIndicators] = useState<NotificationIndicators>({
    hasUnreadNotifications: false,
    hasInboundTrainingPartnerRequests: false,
  });
  const routePanel = parseShellPanel(currentSearchParams.get("panel"));
  const routeModal = parseShellModal(currentSearchParams.get("modal"));
  const trainingPartnersView = parseTrainingPartnersView(
    currentSearchParams.get("trainingPartnersView"),
  );
  const trainingPartnerId =
    currentSearchParams.get("trainingPartnerId") ?? undefined;
  const donationReturn = currentSearchParams.get("donation");
  const donationReturnState =
    donationReturn === "success" || donationReturn === "canceled"
      ? donationReturn
      : undefined;
  const donationSessionId =
    currentSearchParams.get("session_id")?.trim() || undefined;
  const displayedModal = donationReturnState ? "donation" : routeModal;
  const displayedShellModal =
    displayedModal === "profile-search" ? null : displayedModal;
  const displayedPanel = displayedModal ? null : routePanel;

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

  function openPanel(panel: ShellPanel) {
    navigateShellOverlay({ panel, modal: null });
  }

  function closePanel(panel: ShellPanel) {
    const params = new URLSearchParams(window.location.search);
    if (parseShellModal(params.get("modal")) || params.has("donation")) return;
    if (parseShellPanel(params.get("panel")) !== panel) return;
    navigateShellOverlay({ panel: null }, "replace");
  }

  function openModal(action: SidePanelAction) {
    if (action === "saved-techniques") {
      openPanel("saved-techniques");
      return;
    }
    if (action === "training-partners") {
      openPanel("training-partners");
      return;
    }
    navigateShellOverlay({ panel: null, modal: action });
  }

  function closeModal() {
    navigateShellOverlay(
      { modal: null, donationReturn: null, donationSessionId: null },
      "replace",
    );
  }

  function navigateShellOverlay(
    next: {
      panel?: ShellPanel | null;
      modal?: ShellModal | null;
      donationReturn?: string | null;
      donationSessionId?: string | null;
    },
    mode: "push" | "replace" = displayedPanel || displayedModal
      ? "replace"
      : "push",
  ) {
    const params = new URLSearchParams(currentSearchParams);

    if ("panel" in next) {
      if (next.panel) params.set("panel", next.panel);
      else params.delete("panel");
      if (next.panel !== "training-partners") {
        params.delete("trainingPartnersView");
        params.delete("trainingPartnerId");
      }
    }

    if ("modal" in next) {
      if (next.modal) params.set("modal", next.modal);
      else params.delete("modal");
    }

    if ("donationReturn" in next) {
      if (next.donationReturn) params.set("donation", next.donationReturn);
      else params.delete("donation");
    }

    if ("donationSessionId" in next) {
      if (next.donationSessionId) {
        params.set("session_id", next.donationSessionId);
      } else {
        params.delete("session_id");
      }
    }

    const url = `${pathname}${params.size ? `?${params}` : ""}`;
    if (mode === "replace") {
      writeBrowserUrl(url, "replace");
      return;
    }
    writeBrowserUrl(url, "push");
  }

  const handleDonationSuccess = useCallback(() => {
    setCurrentAccount((account) => ({ ...account, donated: true }));
  }, []);

  function openPublicProfile(profile: PublicAccountSummary) {
    openPublicProfileById(profile.id);
  }

  function openPublicProfileById(accountId: string) {
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
              isProfileSearchOpen={displayedModal === "profile-search"}
              onMenuOpen={() => openPanel("navigation")}
              onNotificationsOpen={() => openPanel("notifications")}
              onProfileSearchOpenChange={(open) => {
                if (open) {
                  navigateShellOverlay({
                    panel: null,
                    modal: "profile-search",
                  });
                } else if (displayedModal === "profile-search") {
                  closeModal();
                }
              }}
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
                <div className="hidden sm:block">
                  <h2 className="mt-1 text-xl font-black tracking-tight">
                    Home
                  </h2>
                </div>
                <JournalEntryTable
                  initialEntries={props.initialJournal.items}
                  initialQueryKey={props.initialJournalQueryKey}
                  mobileHeaderContent={
                    <button
                      type="button"
                      className="w-full rounded-md text-left bg-transparent!"
                      onClick={() => openModal("profile")}
                    >
                      <UserSummary
                        className="bg-transparent!"
                        identity={{
                          firstName: currentAccount.firstName,
                          lastName: currentAccount.lastName,
                          belt: currentAccount.belt,
                          profilePhoto: currentAccount.profilePhoto,
                          donated: currentAccount.donated,
                        }}
                        showBeltMarker
                      />
                    </button>
                  }
                  onAddEntry={() => openModal("new-entry")}
                  onEntriesChange={handleJournalEntriesChange}
                  refreshToken={journalRefreshToken}
                />
                {hasJournalEntries ? (
                  <>
                    <TrainingActivity
                      onAddEntry={() => openModal("new-entry")}
                      refreshToken={journalRefreshToken}
                    />
                    <Stats
                      onAddEntry={() => openModal("new-entry")}
                      refreshToken={journalRefreshToken}
                    />
                  </>
                ) : null}
              </>
            )}
          </section>
        </div>
      </div>

      <Sheet
        open={displayedPanel === "navigation"}
        onOpenChange={(open) => {
          if (open) openPanel("navigation");
          else closePanel("navigation");
        }}
      >
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

      <Sheet
        open={displayedPanel === "notifications"}
        onOpenChange={(open) => {
          if (open) openPanel("notifications");
          else closePanel("notifications");
        }}
      >
        <SheetContent className="w-full p-0 sm:max-w-md" side="right">
          <SheetTitle className="sr-only">Notifications</SheetTitle>
          <SheetDescription className="sr-only">
            Review recent Kuzushi Cafe notifications.
          </SheetDescription>
          <NotificationList
            className="h-full max-w-none border-l-0 pt-14"
            onIndicatorsChange={refreshIndicators}
            onOpenLink={(url) => router.push(url)}
            onOpenProfile={openPublicProfileById}
          />
        </SheetContent>
      </Sheet>

      <Sheet
        open={displayedPanel === "saved-techniques"}
        onOpenChange={(open) => {
          if (open) openPanel("saved-techniques");
          else closePanel("saved-techniques");
        }}
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
            onClose={() => closePanel("saved-techniques")}
            presentation="sheet"
          />
        </SheetContent>
      </Sheet>

      <Sheet
        open={displayedPanel === "training-partners"}
        onOpenChange={(open) => {
          if (open) openPanel("training-partners");
          else closePanel("training-partners");
        }}
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
            onClose={() => closePanel("training-partners")}
            onSelectPartner={(profile) => {
              openPublicProfile(profile);
            }}
            view={trainingPartnersView ?? undefined}
            selectedPartnerId={trainingPartnerId}
            onViewChange={(view, partnerId) => {
              const params = new URLSearchParams(currentSearchParams);
              if (view === "custom" || view === "edit") {
                params.set("panel", "training-partners");
                params.set("trainingPartnersView", view);
                if (view === "edit" && partnerId) {
                  params.set("trainingPartnerId", partnerId);
                } else {
                  params.delete("trainingPartnerId");
                }
                writeBrowserUrl(
                  `${pathname}${params.size ? `?${params}` : ""}`,
                  "push",
                );
              } else {
                params.delete("trainingPartnersView");
                params.delete("trainingPartnerId");
                writeBrowserUrl(
                  `${pathname}${params.size ? `?${params}` : ""}`,
                  "replace",
                );
              }
            }}
            presentation="sheet"
          />
        </SheetContent>
      </Sheet>

      <Dialog
        open={displayedShellModal !== null}
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
                  "profile-search": "Search public profiles",
                  "new-entry": "New entry",
                  settings: "Privacy settings",
                  donation: "Donation",
                }[displayedModal]
              : "Dialog"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {displayedModal ? modalDescriptions[displayedModal] : ""}
          </DialogDescription>
          {displayedShellModal === "profile" ? (
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
          {displayedShellModal === "new-entry" ? (
            <JournalEntryCreate
              onClose={closeModal}
              onSaved={() => handleJournalEntriesChange({ hasEntries: true })}
              withinDialog
            />
          ) : null}
          {displayedShellModal === "settings" ? (
            <PrivacySettings onClose={closeModal} withinDialog />
          ) : null}
          {displayedShellModal === "donation" ? (
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

function parseShellPanel(value: string | null): ShellPanel | null {
  return value && shellPanels.has(value) ? (value as ShellPanel) : null;
}

function parseShellModal(value: string | null): ShellModal | null {
  return value && shellModals.has(value) ? (value as ShellModal) : null;
}

function parseTrainingPartnersView(
  value: string | null,
): "custom" | "edit" | null {
  return value === "custom" || value === "edit" ? value : null;
}
