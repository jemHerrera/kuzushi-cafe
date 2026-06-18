"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ApiErrorDetail, SignInResult } from "@/lib/auth/types";
import { AlertBanner } from "./AlertBanner";

export type SignInFormPreviewState =
  | { kind: "idle" }
  | { kind: "error"; message?: string }
  | { kind: "email-sent"; email: string }
  | { kind: "google-loading" }
  | { kind: "magic-link-loading"; email?: string };

const errorMessages: Record<string, string> = {
  expired_link:
    "That sign-in link has expired or was already used. Request a new link.",
  invalid_callback: "That sign-in link is invalid. Request a new link.",
  provider_error: "Google could not complete sign-in. Please try again.",
  account_error: "We could not create or load your account.",
};

function GoogleIcon() {
  return (
    <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

export function SignInForm({
  next,
  initialError,
  previewState,
}: {
  next: string;
  initialError?: string;
  previewState?: SignInFormPreviewState;
}) {
  const isPreview = Boolean(previewState);
  const [email, setEmail] = useState(
    previewState?.kind === "magic-link-loading"
      ? (previewState.email ?? "")
      : "",
  );
  const [sentEmail, setSentEmail] = useState<string | undefined>(
    previewState?.kind === "email-sent" ? previewState.email : undefined,
  );
  const [error, setError] = useState<string | undefined>(
    previewState?.kind === "error"
      ? (previewState.message ?? "Sign-in failed.")
      : initialError
        ? (errorMessages[initialError] ?? "Sign-in failed.")
        : undefined,
  );
  const [pendingProvider, setPendingProvider] = useState<
    "google" | "magic-link" | undefined
  >(
    previewState?.kind === "google-loading"
      ? "google"
      : previewState?.kind === "magic-link-loading"
        ? "magic-link"
        : undefined,
  );

  async function requestSignIn(
    provider: "google" | "magic-link",
    requestedEmail?: string,
  ) {
    if (isPreview) return;

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
        className="h-11 w-full gap-2 bg-zinc-950 font-semibold text-white hover:bg-zinc-800"
        disabled={Boolean(pendingProvider)}
        onClick={() => void requestSignIn("google")}
      >
        <span className="grid size-6 place-items-center rounded-full bg-white">
          <GoogleIcon />
        </span>
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
            {pendingProvider === "magic-link" ? "Sending..." : "Resend"}
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
            Continue
          </Button>
        </form>
      )}
    </div>
  );
}
