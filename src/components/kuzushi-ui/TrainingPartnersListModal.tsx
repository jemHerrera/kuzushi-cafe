"use client";

import { Ban, Check, Inbox, Plus, UserMinus, UsersRound } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  AccountDetail,
  ApiErrorDetail,
  Belt,
  PaginatedResponse,
  PublicAccountSummary,
  TrainingPartnerDetail,
} from "@/lib/managers/types";
import { AlertBanner } from "./AlertBanner";
import { Avatar } from "./Avatar";
import { ButtonPrimary } from "./ButtonPrimary";
import { ButtonSecondary } from "./ButtonSecondary";
import { CustomPartnerInput } from "./CustomPartnerInput";
import { LoadingState } from "./LoadingState";
import { ModalFrame } from "./ModalFrame";
import { TrainingPartnerSearch } from "./TrainingPartnerSearch";
import {
  beltBorderStyles,
  cx,
  formatAgeClass,
  formatBelt,
  formatWeightClass,
} from "./shared";

type ConfirmAction =
  | { type: "remove"; partner: TrainingPartnerDetail }
  | { type: "block"; account: PublicAccountSummary | AccountDetail };

export function TrainingPartnersListModal({
  onClose,
  onTitleChange,
  onSelectPartner,
  withinDialog = false,
}: {
  onClose?: () => void;
  onTitleChange?: (title: string) => void;
  onSelectPartner?: (partner: PublicAccountSummary) => void;
  withinDialog?: boolean;
}) {
  const [view, setView] = useState<"list" | "custom">("list");
  const [activeTab, setActiveTab] = useState<"partners" | "requests">(
    "partners",
  );
  const [query, setQuery] = useState("");
  const [partners, setPartners] = useState<TrainingPartnerDetail[]>([]);
  const [inbound, setInbound] = useState<AccountDetail[]>([]);
  const [error, setError] = useState<string>();
  const [message, setMessage] = useState<string>();
  const [isPartnersLoading, setIsPartnersLoading] = useState(true);
  const [isRequestsLoading, setIsRequestsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirming, setConfirming] = useState<ConfirmAction | null>(null);

  const loadPartners = useCallback(async () => {
    setError(undefined);
    setIsPartnersLoading(true);
    try {
      const params = new URLSearchParams({ limit: "25", offset: "0" });
      if (query.trim()) params.set("search", query.trim());

      const response = await fetch(`/api/training-partners?${params}`);
      if (!response.ok) {
        const detail = (await response.json()) as ApiErrorDetail;
        throw new Error(detail.error.message);
      }

      const result =
        (await response.json()) as PaginatedResponse<TrainingPartnerDetail>;
      setPartners(result.items);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "We could not load training partners.",
      );
    } finally {
      setIsPartnersLoading(false);
    }
  }, [query]);

  const loadRequests = useCallback(async () => {
    setError(undefined);
    setIsRequestsLoading(true);
    try {
      const response = await fetch(
        "/api/training-partners/requests?direction=inbound&limit=25&offset=0",
      );
      if (!response.ok) {
        const detail = (await response.json()) as ApiErrorDetail;
        throw new Error(detail.error.message);
      }

      const result =
        (await response.json()) as PaginatedResponse<AccountDetail>;
      setInbound(result.items);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "We could not load partner requests.",
      );
    } finally {
      setIsRequestsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (view !== "list") return;
    const timeout = window.setTimeout(() => {
      loadPartners();
    }, 200);

    return () => window.clearTimeout(timeout);
  }, [loadPartners, view]);

  useEffect(() => {
    if (view !== "list") return;
    const timeout = window.setTimeout(() => {
      loadRequests();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [loadRequests, view]);

  function openList() {
    setView("list");
    setActiveTab("partners");
    onTitleChange?.("My training partners");
  }

  function openCustomPartner() {
    setView("custom");
    onTitleChange?.("Add custom partner");
  }

  async function runAction(
    label: string,
    request: () => Promise<Response>,
    refresh: () => Promise<void>,
  ) {
    setError(undefined);
    setMessage(undefined);
    setIsSubmitting(true);
    try {
      const response = await request();
      if (!response.ok) {
        const detail = (await response.json()) as ApiErrorDetail;
        throw new Error(detail.error.message);
      }

      setMessage(label);
      await refresh();
    } catch (actionError) {
      setError(
        actionError instanceof Error
          ? actionError.message
          : "We could not update this relationship.",
      );
    } finally {
      setIsSubmitting(false);
      setConfirming(null);
    }
  }

  if (view === "custom") {
    return (
      <CustomPartnerInput
        onBack={openList}
        onClose={onClose}
        onCreated={() => {
          setMessage("Custom training partner added.");
          loadPartners();
        }}
        withinDialog={withinDialog}
      />
    );
  }

  return (
    <ModalFrame
      title="My training partners"
      onClose={onClose}
      withinDialog={withinDialog}
    >
      <div className="flex min-h-80 flex-col gap-4">
        {error ? <AlertBanner message={error} /> : null}
        {message ? <AlertBanner message={message} /> : null}
        <Tabs
          className="min-h-0 flex-1"
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as "partners" | "requests")
          }
        >
          <TabsList className="flex h-auto justify-start w-full gap-2 bg-transparent p-0 mb-4">
            <TabsTrigger
              value="partners"
              className="h-8 gap-2 rounded-full border border-zinc-200 bg-white px-4 data-[state=active]:border-zinc-950 data-[state=active]:bg-zinc-950 data-[state=active]:text-white"
            >
              <UsersRound className="size-4" />
              Training Partners
            </TabsTrigger>
            <TabsTrigger
              value="requests"
              className="h-8 gap-2 rounded-full border border-zinc-200 bg-white px-4 data-[state=active]:border-zinc-950 data-[state=active]:bg-zinc-950 data-[state=active]:text-white"
            >
              <Inbox className="size-4" />
              Partner Requests
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="partners"
            className="mt-1 flex min-h-0 flex-1 flex-col gap-3"
          >
            <TrainingPartnerSearch value={query} onValueChange={setQuery} />
            {isPartnersLoading ? (
              <LoadingState label="Loading training partners" />
            ) : (
              <PartnerList>
                {partners.length ? (
                  partners.map((partner) => (
                    <TrainingPartnerRow
                      key={partner.id}
                      partner={partner}
                      disabled={isSubmitting}
                      onOpen={() => {
                        if (partner.object === "training_partner") {
                          onSelectPartner?.(partnerToPublicSummary(partner));
                        }
                      }}
                      onBlock={
                        partner.object === "training_partner"
                          ? () =>
                              setConfirming({
                                type: "block",
                                account: partnerToPublicSummary(partner),
                              })
                          : undefined
                      }
                      onRemove={() =>
                        setConfirming({ type: "remove", partner })
                      }
                    />
                  ))
                ) : (
                  <EmptyListText>No training partners found.</EmptyListText>
                )}
              </PartnerList>
            )}
            <ButtonPrimary
              className="mt-auto w-full"
              onClick={openCustomPartner}
              type="button"
            >
              <Plus className="size-4" />
              Add custom training partner
            </ButtonPrimary>
          </TabsContent>
          <TabsContent value="requests" className="mt-1 grid gap-3">
            {isRequestsLoading ? (
              <LoadingState label="Loading partner requests" />
            ) : (
              <PartnerList>
                {inbound.length ? (
                  inbound.map((account) => (
                    <AccountRow
                      key={account.id}
                      account={account}
                      disabled={isSubmitting}
                      action={
                        <div className="flex flex-wrap gap-2">
                          <ButtonPrimary
                            type="button"
                            disabled={isSubmitting}
                            onClick={() =>
                              runAction(
                                "Training partner request accepted.",
                                () =>
                                  fetch(
                                    `/api/training-partners/${account.id}/accept`,
                                    { method: "POST" },
                                  ),
                                async () => {
                                  await Promise.all([
                                    loadPartners(),
                                    loadRequests(),
                                  ]);
                                },
                              )
                            }
                          >
                            <Check className="size-4" />
                            Accept
                          </ButtonPrimary>
                          <ButtonSecondary
                            type="button"
                            disabled={isSubmitting}
                            onClick={() =>
                              setConfirming({ type: "block", account })
                            }
                          >
                            <Ban className="size-4" />
                            Block
                          </ButtonSecondary>
                        </div>
                      }
                      onOpen={() => onSelectPartner?.(accountToPublic(account))}
                    />
                  ))
                ) : (
                  <EmptyListText>No inbound requests.</EmptyListText>
                )}
              </PartnerList>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <AlertDialog
        open={confirming !== null}
        onOpenChange={(open) => {
          if (!open) setConfirming(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirming?.type === "block"
                ? `Block ${displayAccountName(confirming.account)}?`
                : `Remove ${confirming ? displayPartnerName(confirming.partner) : "partner"}?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirming?.type === "block"
                ? "Blocked accounts cannot send you training-partner requests until you unblock them."
                : "This removes the partner from your accepted training-partner list."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isSubmitting}
              variant="destructive"
              onClick={(event) => {
                event.preventDefault();
                if (!confirming) return;
                if (confirming.type === "block") {
                  runAction(
                    "Account blocked.",
                    () =>
                      fetch(
                        `/api/training-partners/${confirming.account.id}/block`,
                        {
                          method: "POST",
                        },
                      ),
                    async () => {
                      await Promise.all([loadPartners(), loadRequests()]);
                    },
                  );
                  return;
                }

                runAction(
                  "Training partner removed.",
                  () =>
                    fetch(`/api/training-partners/${confirming.partner.id}`, {
                      method: "DELETE",
                    }),
                  loadPartners,
                );
              }}
            >
              {confirming?.type === "block" ? "Block" : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ModalFrame>
  );
}

function PartnerList({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-1.5">{children}</div>;
}

function TrainingPartnerRow({
  disabled,
  onBlock,
  onOpen,
  onRemove,
  partner,
}: {
  disabled: boolean;
  onBlock?: () => void;
  onOpen: () => void;
  onRemove: () => void;
  partner: TrainingPartnerDetail;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-md border border-zinc-200 bg-white p-2">
      <ProfileButton
        belt={partner.belt}
        disabled={disabled || partner.object !== "training_partner"}
        meta={partnerMeta(partner)}
        name={displayPartnerName(partner)}
        photo={
          partner.object === "training_partner"
            ? partner.profilePhoto
            : undefined
        }
        onOpen={onOpen}
      />
      <div className="ml-auto flex flex-wrap gap-2">
        {onBlock ? (
          <ButtonSecondary type="button" onClick={onBlock} disabled={disabled}>
            <Ban className="size-4" />
            Block
          </ButtonSecondary>
        ) : null}
        <ButtonSecondary type="button" onClick={onRemove} disabled={disabled}>
          <UserMinus className="size-4" />
          Remove
        </ButtonSecondary>
      </div>
    </div>
  );
}

function AccountRow({
  account,
  action,
  disabled,
  onOpen,
}: {
  account: AccountDetail;
  action: React.ReactNode;
  disabled: boolean;
  onOpen: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-md border border-zinc-200 bg-white p-2">
      <ProfileButton
        belt={account.belt}
        disabled={disabled}
        meta={`${formatBelt(account.belt)} belt`}
        name={displayAccountName(account)}
        photo={account.profilePhoto}
        onOpen={onOpen}
      />
      <div className="ml-auto">{action}</div>
    </div>
  );
}

function ProfileButton({
  belt,
  disabled,
  meta,
  name,
  onOpen,
  photo,
}: {
  belt?: Belt;
  disabled: boolean;
  meta: string;
  name: string;
  onOpen: () => void;
  photo?: string;
}) {
  return (
    <button
      className="flex min-w-0 flex-1 items-center gap-3 rounded-md text-left transition hover:bg-zinc-50 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none"
      type="button"
      onClick={onOpen}
      disabled={disabled}
    >
      <span
        className={cx(
          "inline-flex shrink-0 rounded-full border-[3px] p-0",
          beltBorderStyles[belt ?? "unknown"],
        )}
      >
        <Avatar initials={initialsForName(name)} src={photo} size="xs" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-zinc-950">
          {name}
        </span>
        <span className="block truncate text-xs text-zinc-500">{meta}</span>
      </span>
    </button>
  );
}

function EmptyListText({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-md px-2 py-2 text-sm text-zinc-500">{children}</p>
  );
}

function partnerToPublicSummary(
  partner: Extract<TrainingPartnerDetail, { object: "training_partner" }>,
): PublicAccountSummary {
  return {
    id: partner.accountId,
    object: "public_account_summary",
    firstName: partner.firstName,
    lastName: partner.lastName,
    profilePhoto: partner.profilePhoto,
    belt: partner.belt,
    relationshipStatus: "accepted",
  };
}

function accountToPublic(account: AccountDetail): PublicAccountSummary {
  return {
    id: account.id,
    object: "public_account_summary",
    firstName: account.firstName,
    lastName: account.lastName,
    bio: account.bio,
    profilePhoto: account.profilePhoto,
    belt: account.belt,
    relationshipStatus: "pending-inbound",
  };
}

function displayPartnerName(partner: TrainingPartnerDetail) {
  return (
    [partner.firstName, partner.lastName].filter(Boolean).join(" ") ||
    "Unnamed partner"
  );
}

function displayAccountName(account: PublicAccountSummary | AccountDetail) {
  return (
    [account.firstName, account.lastName].filter(Boolean).join(" ") ||
    "Unnamed grappler"
  );
}

function partnerMeta(partner: TrainingPartnerDetail) {
  if (partner.object === "training_partner") {
    return `${formatBelt(partner.belt)} belt / ${formatWeightClass(partner.weight)}`;
  }

  return [
    partner.belt ? `${formatBelt(partner.belt)} belt` : undefined,
    partner.weight ? formatWeightClass(partner.weight) : undefined,
    partner.age ? formatAgeClass(partner.age) : undefined,
  ]
    .filter(Boolean)
    .join(" / ");
}

function initialsForName(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "KC"
  );
}
