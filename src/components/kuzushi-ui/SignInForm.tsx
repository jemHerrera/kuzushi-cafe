"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ApiErrorDetail, SignInResult } from "@/lib/auth/types";
import { AlertBanner } from "./AlertBanner";

const errorMessages: Record<string, string> = {
  expired_link:
    "That sign-in link has expired or was already used. Request a new link.",
  invalid_callback: "That sign-in link is invalid. Request a new link.",
  provider_error: "Google could not complete sign-in. Please try again.",
  account_error: "We could not create or load your account.",
};

export function SignInForm({
  next,
  initialError,
}: {
  next: string;
  initialError?: string;
}) {
  const [email, setEmail] = useState("");
  const [sentEmail, setSentEmail] = useState<string>();
  const [error, setError] = useState<string | undefined>(
    initialError
      ? (errorMessages[initialError] ?? "Sign-in failed.")
      : undefined,
  );
  const [pendingProvider, setPendingProvider] = useState<
    "google" | "magic-link"
  >();

  async function requestSignIn(
    provider: "google" | "magic-link",
    requestedEmail?: string,
  ) {
    setError(undefined);
    setPendingProvider(provider);

    try {
      const response = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          redirectTo: next,
          ...(provider === "magic-link" ? { email: requestedEmail } : {}),
        }),
      });
      const detail = (await response.json()) as SignInResult | ApiErrorDetail;

      if (!response.ok || "error" in detail) {
        throw new Error(
          "error" in detail
            ? detail.error.message
            : "Sign-in could not be started.",
        );
      }

      if (detail.status === "redirect_required") {
        window.location.assign(detail.redirectUrl);
        return;
      }

      setSentEmail(detail.email);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Sign-in could not be started.",
      );
    } finally {
      setPendingProvider(undefined);
    }
  }

  function submitEmail(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void requestSignIn("magic-link", email);
  }

  return (
    <div className="grid gap-5">
      {error ? <AlertBanner message={error} /> : null}
      <Button
        type="button"
        variant="outline"
        className="h-11 w-full font-semibold"
        disabled={Boolean(pendingProvider)}
        onClick={() => void requestSignIn("google")}
      >
        {pendingProvider === "google"
          ? "Connecting to Google..."
          : "Continue with Google"}
      </Button>

      <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-zinc-500">
        <span className="h-px flex-1 bg-zinc-200" />
        or
        <span className="h-px flex-1 bg-zinc-200" />
      </div>

      {sentEmail ? (
        <div className="grid gap-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
          <div className="flex gap-3">
            <Mail className="mt-0.5 size-5 text-zinc-700" />
            <div>
              <p className="font-semibold text-zinc-950">Check your email</p>
              <p className="mt-1 text-sm leading-6 text-zinc-600">
                We sent a sign-in link to {sentEmail}.
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            className="justify-start pl-8 underline"
            disabled={Boolean(pendingProvider)}
            onClick={() => void requestSignIn("magic-link", sentEmail)}
          >
            {pendingProvider === "magic-link"
              ? "Sending..."
              : "Resend sign-in link"}
          </Button>
        </div>
      ) : (
        <form className="grid gap-3" onSubmit={submitEmail}>
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="h-11"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={Boolean(pendingProvider)}
            required
          />
          <Button
            type="submit"
            className="h-11 font-semibold"
            disabled={Boolean(pendingProvider) || !email.trim()}
          >
            {pendingProvider === "magic-link"
              ? "Sending link..."
              : "Email me a sign-in link"}
          </Button>
        </form>
      )}
    </div>
  );
}
