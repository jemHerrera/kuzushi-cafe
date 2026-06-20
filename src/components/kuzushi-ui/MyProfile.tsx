"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { AccountDetail, ApiErrorDetail } from "@/lib/managers/types";
import { AlertBanner } from "./AlertBanner";
import { Avatar } from "./Avatar";
import { ButtonPrimary } from "./ButtonPrimary";
import { DonorBadge } from "./DonorBadge";
import { ModalFrame } from "./ModalFrame";
import {
  ProfileFields,
  sampleProfileValue,
  type ProfileFormValue,
} from "./ProfileFields";

function dateInputValue(date: Date | undefined) {
  if (!date) return undefined;
  return date.toISOString().slice(0, 10);
}

export function MyProfile({
  onClose,
  withinDialog = false,
  initialProfile = sampleProfileValue,
  donated = false,
  profilePhoto,
  onSaved,
}: {
  onClose?: () => void;
  withinDialog?: boolean;
  initialProfile?: ProfileFormValue;
  donated?: boolean;
  profilePhoto?: string;
  onSaved?: (account: AccountDetail) => void;
}) {
  const router = useRouter();
  const [profile, setProfile] = useState(initialProfile);
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initials =
    [profile.firstName, profile.lastName]
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "KC";

  async function submitProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);

    if (!profile.firstName.trim() || !profile.lastName.trim()) {
      setError("First and last name are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/account/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: profile.firstName,
          lastName: profile.lastName,
          belt: profile.belt,
          weight: profile.weight,
          birthday: dateInputValue(profile.birthday),
          bio: profile.bio || undefined,
        }),
      });

      if (!response.ok) {
        const detail = (await response.json()) as ApiErrorDetail;
        throw new Error(detail.error.message);
      }

      const account = (await response.json()) as AccountDetail;
      onSaved?.(account);
      toast.success("Profile saved.");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "We could not save your profile.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ModalFrame
      title="My profile"
      onClose={onClose}
      withinDialog={withinDialog}
      className="p-3 sm:p-5"
    >
      <form
        className="grid gap-5 sm:grid-cols-[5rem_minmax(0,1fr)] sm:items-start"
        onSubmit={submitProfile}
      >
        <div className="grid justify-items-start gap-2">
          <Avatar initials={initials} src={profilePhoto} size="lg" />
          {donated ? <DonorBadge /> : null}
        </div>
        <div className="grid gap-4">
          {error ? <AlertBanner message={error} /> : null}
          <ProfileFields
            value={profile}
            onChange={setProfile}
            disabled={isSubmitting}
          />
          <div className="flex justify-end">
            <ButtonPrimary
              type="submit"
              disabled={
                isSubmitting ||
                !profile.firstName.trim() ||
                !profile.lastName.trim()
              }
            >
              {isSubmitting ? "Saving..." : "Save profile"}
            </ButtonPrimary>
          </div>
        </div>
      </form>
    </ModalFrame>
  );
}
