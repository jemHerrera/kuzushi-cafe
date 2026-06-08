"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { AccountDetail, ApiErrorDetail } from "@/lib/auth/types";
import { ButtonPrimary } from "./ButtonPrimary";
import { AlertBanner } from "./AlertBanner";
import {
  ProfileFields,
  sampleProfileValue,
  type ProfileFormValue,
} from "./ProfileFields";

function dateInputValue(date: Date | undefined) {
  if (!date) return undefined;
  return date.toISOString().slice(0, 10);
}

export function CompleteProfile({
  account,
  next = "/app",
}: {
  account?: AccountDetail;
  next?: string;
}) {
  const router = useRouter();
  const isConnected = Boolean(account);
  const [profile, setProfile] = useState<ProfileFormValue>(() =>
    account
      ? {
          firstName: account.firstName ?? "",
          lastName: account.lastName ?? "",
          belt: account.belt,
          weight: account.weight,
          birthday: account.birthday ? new Date(account.birthday) : undefined,
          bio: account.bio ?? "",
        }
      : sampleProfileValue,
  );
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);

    if (!profile.firstName.trim() || !profile.lastName.trim()) {
      setError("First and last name are required.");
      return;
    }

    if (!isConnected) return;

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

      router.push(next);
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
    <form
      className="mx-auto grid min-h-screen w-full max-w-2xl content-center gap-5 px-6 py-10"
      onSubmit={submitProfile}
    >
      <h1 className="text-3xl font-black text-zinc-950">Complete profile</h1>
      <p className="text-sm leading-6 text-zinc-600">
        Add your name to finish setting up your account. The remaining fields
        are optional.
      </p>
      {error ? <AlertBanner message={error} /> : null}
      <ProfileFields
        value={profile}
        onChange={setProfile}
        disabled={isSubmitting}
      />
      <div className="flex justify-end">
        <ButtonPrimary type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Continue"}
        </ButtonPrimary>
      </div>
    </form>
  );
}
