"use client";

import {
  ArrowLeft,
  Ban,
  Check,
  LockKeyhole,
  UserMinus,
  UserPlus,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import type {
  ApiErrorDetail,
  PublicProfileDetail,
  TrainingPartnerRelationshipStatus,
} from "@/lib/managers/types";
import { Button } from "@/components/ui/button";
import { Avatar } from "./Avatar";
import { ButtonPrimary } from "./ButtonPrimary";
import { ButtonSecondary } from "./ButtonSecondary";
import { DestructiveConfirmDialog } from "./DestructiveConfirmDialog";
import { ErrorState } from "./ErrorState";
import { JournalEntryTable } from "./JournalEntryTable";
import { LoadingState } from "./LoadingState";
import { Stats } from "./Stats";
import { TrainingActivity } from "./TrainingActivity";
import { beltBorderStyles, cx, formatBelt } from "./shared";

type DestructiveAction = "remove" | "block";

export function PublicProfile({
  accountId,
  initialProfile,
  onClose,
  onRelationshipChange,
}: {
  accountId: string;
  initialProfile?: PublicProfileDetail;
  onClose?: () => void;
  onRelationshipChange?: () => void;
}) {
  const [profile, setProfile] = useState<PublicProfileDetail | undefined>(
    initialProfile,
  );
  const [status, setStatus] = useState<
    TrainingPartnerRelationshipStatus | undefined
  >(initialProfile?.relationshipStatus);
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(!initialProfile);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirming, setConfirming] = useState<DestructiveAction | null>(null);
  const [retryToken, setRetryToken] = useState(0);

  useEffect(() => {
    if (initialProfile) return;

    let isActive = true;

    async function loadProfile() {
      setIsLoading(true);
      setError(undefined);
      try {
        const response = await fetch(`/api/accounts/${accountId}`);
        if (!response.ok) {
          const detail = (await response.json()) as ApiErrorDetail;
          throw new Error(detail.error.message);
        }

        const loaded = (await response.json()) as PublicProfileDetail;
        if (!isActive) return;
        setProfile(loaded);
        setStatus(loaded.relationshipStatus);
      } catch (loadError) {
        if (!isActive) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "We could not load this profile.",
        );
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    loadProfile();

    return () => {
      isActive = false;
    };
  }, [accountId, initialProfile, retryToken]);

  async function runAction(
    label: string,
    request: () => Promise<Response>,
    nextStatus?: TrainingPartnerRelationshipStatus,
    rethrow = false,
  ) {
    setError(undefined);
    setIsSubmitting(true);
    try {
      const response = await request();
      if (!response.ok) {
        const detail = (await response.json()) as ApiErrorDetail;
        throw new Error(detail.error.message);
      }

      if (nextStatus) {
        setStatus(nextStatus);
        setProfile((current) =>
          current ? { ...current, relationshipStatus: nextStatus } : current,
        );
      }
      toast.success(label);
      onRelationshipChange?.();
    } catch (actionError) {
      const actionMessage =
        actionError instanceof Error
          ? actionError.message
          : "We could not update this relationship.";
      if (rethrow) throw new Error(actionMessage);
      setError(actionMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  const name = profile ? displayName(profile) : "Public profile";

  const hasVisibleContent =
    profile &&
    (profile.visibility.journalEntries ||
      profile.visibility.activity ||
      profile.visibility.stats);

  return (
    <section className="grid gap-8">
      {isLoading ? (
        <LoadingState label="Loading public profile" variant="profile" />
      ) : null}
      {error ? (
        <ErrorState
          message={error}
          onRetry={
            profile ? undefined : () => setRetryToken((token) => token + 1)
          }
        />
      ) : null}
      {profile ? (
        <>
          <header className="flex gap-5 sm:items-start sm:p-6">
            {onClose ? (
              <Button
                aria-label="Back"
                className="shrink-0"
                size="icon"
                type="button"
                variant="ghost"
                onClick={onClose}
              >
                <ArrowLeft className="size-4" />
              </Button>
            ) : null}
            <span
              className={cx(
                "inline-flex w-fit h-fit shrink-0 rounded-full border-4 p-0",
                beltBorderStyles[profile.belt ?? "unknown"],
              )}
            >
              <Avatar
                initials={initialsForProfile(profile)}
                src={profile.profilePhoto}
                size="lg"
              />
            </span>
            <div className="grid min-w-0 flex-1 gap-5">
              <div>
                <h1 className="text-xl font-black tracking-tight text-zinc-950">
                  {name}
                </h1>
                <p className="mt-1 text-sm text-zinc-500">
                  {profile.belt ? formatBelt(profile.belt) : "Unknown"} belt
                </p>
                {profile.bio ? (
                  <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-600">
                    {profile.bio}
                  </p>
                ) : null}
              </div>
              <RelationshipActions
                disabled={isSubmitting}
                status={status}
                onAccept={() =>
                  runAction(
                    "Training partner request accepted.",
                    () =>
                      fetch(`/api/training-partners/${accountId}/accept`, {
                        method: "POST",
                      }),
                    "accepted",
                  )
                }
                onAdd={() =>
                  runAction(
                    "Training partner request sent.",
                    () =>
                      fetch(`/api/training-partners/${accountId}/request`, {
                        method: "POST",
                      }),
                    "pending-outbound",
                  )
                }
                onCancel={() =>
                  runAction(
                    "Training partner request canceled.",
                    () =>
                      fetch(`/api/training-partners/${accountId}/request`, {
                        method: "DELETE",
                      }),
                    "none",
                  )
                }
                onBlock={() => setConfirming("block")}
                onRemove={() => setConfirming("remove")}
                onUnblock={() =>
                  runAction(
                    "Account unblocked.",
                    () =>
                      fetch(`/api/training-partners/${accountId}/block`, {
                        method: "DELETE",
                      }),
                    "none",
                  )
                }
              />
            </div>
          </header>
          {profile.visibility.journalEntries ? (
            <section className="grid gap-3" aria-labelledby="profile-journal">
              <JournalEntryTable accountId={accountId} readOnly />
            </section>
          ) : null}
          {profile.visibility.activity ? (
            <TrainingActivity accountId={accountId} />
          ) : null}
          {profile.visibility.stats ? <Stats accountId={accountId} /> : null}
          {!hasVisibleContent ? (
            <div className="grid justify-items-center gap-3 px-5 py-12 text-center">
              <span className="inline-flex size-11 items-center justify-center rounded-full bg-zinc-100 text-zinc-600">
                <LockKeyhole className="size-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-zinc-950">
                  This account is private
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  No journal, activity, or stats are visible to you.
                </p>
              </div>
            </div>
          ) : null}
        </>
      ) : null}
      <DestructiveConfirmDialog
        actionLabel={confirming === "block" ? "Block" : "Remove"}
        description={
          confirming === "block"
            ? "They will not be able to request you as a training partner until you unblock them."
            : "This removes the accepted relationship for both accounts."
        }
        disabled={isSubmitting}
        onConfirm={async () => {
          if (confirming === "block") {
            await runAction(
              "Account blocked.",
              () =>
                fetch(`/api/training-partners/${accountId}/block`, {
                  method: "POST",
                }),
              "blocked",
              true,
            );
            return;
          }

          await runAction(
            "Training partner removed.",
            () => removeAcceptedPartner(accountId),
            "removed",
            true,
          );
        }}
        open={confirming !== null}
        onOpenChange={(open) => {
          if (!open) setConfirming(null);
        }}
        pendingLabel={confirming === "block" ? "Blocking..." : "Removing..."}
        title={confirming === "block" ? `Block ${name}?` : `Remove ${name}?`}
      />
    </section>
  );
}

function RelationshipActions({
  disabled,
  status,
  onAccept,
  onAdd,
  onBlock,
  onCancel,
  onRemove,
  onUnblock,
}: {
  disabled: boolean;
  status?: TrainingPartnerRelationshipStatus;
  onAccept: () => void;
  onAdd: () => void;
  onBlock: () => void;
  onCancel: () => void;
  onRemove: () => void;
  onUnblock: () => void;
}) {
  if (status === "accepted") {
    return (
      <div className="flex flex-wrap gap-2">
        <ButtonSecondary
          type="button"
          variant="small"
          onClick={onRemove}
          disabled={disabled}
        >
          <UserMinus className="size-4" />
          Remove
        </ButtonSecondary>
      </div>
    );
  }

  if (status === "pending-inbound") {
    return (
      <div className="flex flex-wrap gap-2">
        <ButtonPrimary
          variant="small"
          type="button"
          onClick={onAccept}
          disabled={disabled}
        >
          <Check className="size-4" />
          Accept request
        </ButtonPrimary>
        <ButtonSecondary
          variant="small"
          type="button"
          onClick={onBlock}
          disabled={disabled}
        >
          <Ban className="size-4" />
          Block
        </ButtonSecondary>
      </div>
    );
  }

  if (status === "pending-outbound") {
    return (
      <div className="flex flex-wrap gap-2">
        <ButtonSecondary
          variant="small"
          type="button"
          onClick={onCancel}
          disabled={disabled}
        >
          <X className="size-4" />
          Cancel request
        </ButtonSecondary>
      </div>
    );
  }

  if (status === "blocked") {
    return (
      <div className="flex flex-wrap gap-2">
        <ButtonSecondary
          variant="small"
          type="button"
          onClick={onUnblock}
          disabled={disabled}
        >
          Unblock
        </ButtonSecondary>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <ButtonPrimary
        type="button"
        variant="small"
        onClick={onAdd}
        disabled={disabled}
      >
        <UserPlus className="size-4" />
        Add as Training Partner
      </ButtonPrimary>
      <ButtonSecondary
        type="button"
        variant="small"
        onClick={onBlock}
        disabled={disabled}
      >
        <Ban className="size-4" />
        Block
      </ButtonSecondary>
    </div>
  );
}

function displayName(profile: PublicProfileDetail) {
  return (
    [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
    "Unnamed grappler"
  );
}

function initialsForProfile(profile: PublicProfileDetail) {
  return (
    [profile.firstName, profile.lastName]
      .filter(Boolean)
      .map((part) => part!.charAt(0).toUpperCase())
      .join("") || "KC"
  );
}

async function removeAcceptedPartner(accountId: string) {
  const limit = 100;
  let offset = 0;
  let partner: { id: string } | undefined;
  let listResponse: Response | undefined;

  while (!partner) {
    const params = new URLSearchParams({
      limit: String(limit),
      offset: String(offset),
    });
    listResponse = await fetch(`/api/training-partners?${params}`);

    if (!listResponse.ok) return listResponse;

    const result = (await listResponse.json()) as {
      items: Array<{ id: string; object: string; accountId?: string }>;
    };
    partner = result.items.find(
      (item) =>
        item.object === "training_partner" && item.accountId === accountId,
    );
    if (partner || result.items.length < limit) break;
    offset += limit;
  }

  if (!partner) {
    return new Response(
      JSON.stringify({
        error: {
          code: "training_partner_not_found",
          message: "Training partner not found.",
        },
      }),
      { status: 404, headers: { "Content-Type": "application/json" } },
    );
  }

  return fetch(`/api/training-partners/${partner.id}`, { method: "DELETE" });
}
