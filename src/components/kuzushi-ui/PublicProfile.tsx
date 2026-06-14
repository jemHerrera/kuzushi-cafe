"use client";

import { Ban, Check, UserMinus, UserPlus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import type {
  ApiErrorDetail,
  PublicAccountSummary,
  TrainingPartnerRelationshipStatus,
} from "@/lib/managers/types";
import { Avatar } from "./Avatar";
import { ButtonPrimary } from "./ButtonPrimary";
import { ButtonSecondary } from "./ButtonSecondary";
import { DestructiveConfirmDialog } from "./DestructiveConfirmDialog";
import { ErrorState } from "./ErrorState";
import { LoadingState } from "./LoadingState";
import { ModalFrame } from "./ModalFrame";
import { TrainingActivity } from "./TrainingActivity";
import { beltBorderStyles, cx, formatBelt } from "./shared";

type DestructiveAction = "remove" | "block";

export function PublicProfile({
  accountId,
  initialProfile,
  onClose,
  onRelationshipChange,
  withinDialog = false,
}: {
  accountId: string;
  initialProfile?: PublicAccountSummary;
  onClose?: () => void;
  onRelationshipChange?: () => void;
  withinDialog?: boolean;
}) {
  const [profile, setProfile] = useState<PublicAccountSummary | undefined>(
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

        const loaded = (await response.json()) as PublicAccountSummary;
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

  return (
    <ModalFrame
      title={name}
      onClose={onClose}
      withinDialog={withinDialog}
      className="p-3 sm:p-5"
    >
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
        <section className="grid gap-5">
          <header className="flex flex-wrap items-start gap-3 border-b border-zinc-200 pb-5">
            <span
              className={cx(
                "inline-flex shrink-0 rounded-full border-[3px] p-0",
                beltBorderStyles[profile.belt ?? "unknown"],
              )}
            >
              <Avatar
                initials={initialsForProfile(profile)}
                src={profile.profilePhoto}
                size="md"
              />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-bold text-zinc-950">{name}</h2>
              <p className="mt-1 text-sm font-medium text-zinc-500">
                {profile.belt ? formatBelt(profile.belt) : "Unknown"} belt /
                {` ${relationshipLabel(status)}`}
              </p>
              {profile.bio ? (
                <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
                  {profile.bio}
                </p>
              ) : null}
            </div>
          </header>
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
          <section className="grid gap-3 border-t border-zinc-200 pt-5">
            <div>
              <h3 className="text-lg font-bold text-zinc-950">
                Training activity
              </h3>
              <p className="text-sm text-zinc-500">
                Journal activity visible to you over the last 12 months.
              </p>
            </div>
            <TrainingActivity accountId={accountId} showHeading={false} />
          </section>
        </section>
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
    </ModalFrame>
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
      <div className="flex flex-wrap justify-end gap-2">
        <ButtonSecondary type="button" onClick={onRemove} disabled={disabled}>
          <UserMinus className="size-4" />
          Remove
        </ButtonSecondary>
        <ButtonSecondary type="button" onClick={onBlock} disabled={disabled}>
          <Ban className="size-4" />
          Block
        </ButtonSecondary>
      </div>
    );
  }

  if (status === "pending-inbound") {
    return (
      <div className="flex flex-wrap justify-end gap-2">
        <ButtonPrimary type="button" onClick={onAccept} disabled={disabled}>
          <Check className="size-4" />
          Accept request
        </ButtonPrimary>
        <ButtonSecondary type="button" onClick={onBlock} disabled={disabled}>
          <Ban className="size-4" />
          Block
        </ButtonSecondary>
      </div>
    );
  }

  if (status === "pending-outbound") {
    return (
      <div className="flex flex-wrap justify-end gap-2">
        <ButtonSecondary type="button" onClick={onCancel} disabled={disabled}>
          <X className="size-4" />
          Cancel request
        </ButtonSecondary>
      </div>
    );
  }

  if (status === "blocked") {
    return (
      <div className="flex flex-wrap justify-end gap-2">
        <ButtonSecondary type="button" onClick={onUnblock} disabled={disabled}>
          Unblock
        </ButtonSecondary>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-end gap-2">
      <ButtonPrimary type="button" onClick={onAdd} disabled={disabled}>
        <UserPlus className="size-4" />
        Add partner
      </ButtonPrimary>
      <ButtonSecondary type="button" onClick={onBlock} disabled={disabled}>
        <Ban className="size-4" />
        Block
      </ButtonSecondary>
    </div>
  );
}

function displayName(profile: PublicAccountSummary) {
  return (
    [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
    "Unnamed grappler"
  );
}

function initialsForProfile(profile: PublicAccountSummary) {
  return (
    [profile.firstName, profile.lastName]
      .filter(Boolean)
      .map((part) => part!.charAt(0).toUpperCase())
      .join("") || "KC"
  );
}

function relationshipLabel(status: PublicAccountSummary["relationshipStatus"]) {
  const labels: Record<TrainingPartnerRelationshipStatus, string> = {
    none: "Not connected",
    "pending-inbound": "Request received",
    "pending-outbound": "Request sent",
    accepted: "Training partner",
    blocked: "Blocked",
    removed: "Removed",
  };

  return status ? labels[status] : "Public profile";
}

async function removeAcceptedPartner(accountId: string) {
  const params = new URLSearchParams({ limit: "100", offset: "0" });
  const listResponse = await fetch(`/api/training-partners?${params}`);

  if (!listResponse.ok) return listResponse;

  const result = (await listResponse.json()) as {
    items: Array<{ id: string; object: string; accountId?: string }>;
  };
  const partner = result.items.find(
    (item) =>
      item.object === "training_partner" && item.accountId === accountId,
  );

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
