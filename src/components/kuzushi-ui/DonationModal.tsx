"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, CircleX, LoaderCircle, RefreshCcw } from "lucide-react";

import { Input } from "@/components/ui/input";
import type {
  ApiErrorDetail,
  DonationCheckoutStatus,
} from "@/lib/managers/types";
import { ButtonPrimary } from "./ButtonPrimary";
import { ButtonSecondary } from "./ButtonSecondary";
import { ModalFrame } from "./ModalFrame";
import { cx } from "./shared";

const presetAmounts = [5, 10, 25] as const;
const checkoutStatusRetryDelays = [600, 1_000, 1_600, 2_400] as const;

type DonationReturn = "success" | "canceled";
type DonationView = "form" | "checking" | DonationCheckoutStatus;

export function DonationModal({
  onClose,
  onSuccess,
  returnState,
  sessionId,
  withinDialog = false,
}: {
  onClose?: () => void;
  onSuccess?: () => void;
  returnState?: DonationReturn;
  sessionId?: string;
  withinDialog?: boolean;
}) {
  const [amount, setAmount] = useState("10");
  const [selectedPreset, setSelectedPreset] = useState<number | null>(10);
  const [view, setView] = useState<DonationView>(
    returnState === "success"
      ? sessionId
        ? "checking"
        : "retryable-failure"
      : returnState === "canceled"
        ? "canceled"
        : "form",
  );
  const [error, setError] = useState<string | undefined>(
    returnState === "success" && !sessionId
      ? "Stripe did not return a checkout session to verify."
      : undefined,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const checkStatus = useCallback(async () => {
    if (!sessionId) {
      setView("retryable-failure");
      setError("Stripe did not return a checkout session to verify.");
      return;
    }

    setView("checking");
    setError(undefined);

    try {
      const status = await fetchCheckoutStatusWithRetry(sessionId);
      if (status === "success") onSuccess?.();
      setView(status);
    } catch (statusError) {
      if (isAbortError(statusError)) return;
      setView("retryable-failure");
      setError(
        statusError instanceof Error
          ? statusError.message
          : "We could not verify the donation.",
      );
    }
  }, [onSuccess, sessionId]);

  useEffect(() => {
    if (returnState !== "success" || !sessionId) return;

    let isActive = true;
    const abortController = new AbortController();
    const checkoutSessionId = sessionId;

    async function loadStatus() {
      try {
        const status = await fetchCheckoutStatusWithRetry(checkoutSessionId, {
          signal: abortController.signal,
        });
        if (!isActive) return;
        if (status === "success") onSuccess?.();
        setView(status);
      } catch (statusError) {
        if (isAbortError(statusError)) return;
        if (!isActive) return;
        setView("retryable-failure");
        setError(
          statusError instanceof Error
            ? statusError.message
            : "We could not verify the donation.",
        );
      }
    }

    void loadStatus();
    return () => {
      isActive = false;
      abortController.abort();
    };
  }, [onSuccess, returnState, sessionId]);

  function selectPreset(nextAmount: number) {
    setAmount(String(nextAmount));
    setSelectedPreset(nextAmount);
    setError(undefined);
  }

  function updateCustomAmount(value: string) {
    setAmount(value);
    setSelectedPreset(null);
    setError(undefined);
  }

  async function createCheckout() {
    const parsedAmount = Number(amount);
    if (
      !Number.isSafeInteger(parsedAmount) ||
      parsedAmount < 1 ||
      parsedAmount > 10_000
    ) {
      setError("Enter a whole dollar amount between $1 and $10,000.");
      return;
    }

    setIsSubmitting(true);
    setError(undefined);

    try {
      const successUrl = new URL(window.location.href);
      successUrl.search = "";
      successUrl.searchParams.set("donation", "success");

      const cancelUrl = new URL(window.location.href);
      cancelUrl.search = "";
      cancelUrl.searchParams.set("donation", "canceled");

      const response = await fetch("/api/donations/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parsedAmount,
          successUrl: successUrl.toString(),
          cancelUrl: cancelUrl.toString(),
        }),
      });
      const detail = (await response.json()) as
        | { checkoutUrl: string }
        | ApiErrorDetail;

      if (!response.ok || "error" in detail) {
        throw new Error(
          "error" in detail
            ? detail.error.message
            : "Stripe Checkout is temporarily unavailable.",
        );
      }

      window.location.assign(detail.checkoutUrl);
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Stripe Checkout is temporarily unavailable.",
      );
      setIsSubmitting(false);
    }
  }

  function showForm() {
    setView("form");
    setError(undefined);
  }

  return (
    <ModalFrame
      title="Support Kuzushi Cafe"
      onClose={onClose}
      withinDialog={withinDialog}
      className="p-3 sm:p-5"
    >
      {view === "form" ? (
        <>
          <p className="text-sm leading-6 text-zinc-600">
            This app is free and built in my spare time. There are no ads or
            subscriptions. Donations go toward hosting and ongoing development.
          </p>
          <div className="grid grid-cols-3 gap-2" aria-label="Donation amount">
            {presetAmounts.map((preset) => (
              <button
                key={preset}
                type="button"
                aria-pressed={selectedPreset === preset}
                className={cx(
                  "h-10 rounded-md border text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50",
                  selectedPreset === preset
                    ? "border-zinc-950 bg-zinc-950 text-white"
                    : "border-zinc-300 bg-white text-zinc-950 hover:bg-zinc-50",
                )}
                disabled={isSubmitting}
                onClick={() => selectPreset(preset)}
              >
                ${preset}
              </button>
            ))}
          </div>
          <label className="grid gap-1.5 text-sm font-semibold text-zinc-900">
            Custom amount
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-zinc-500">
                $
              </span>
              <Input
                aria-invalid={Boolean(error)}
                className="h-10 pl-7"
                disabled={isSubmitting}
                inputMode="numeric"
                min={1}
                max={10_000}
                name="donation-amount"
                onChange={(event) => updateCustomAmount(event.target.value)}
                step={1}
                type="number"
                value={amount}
              />
            </div>
          </label>
          {error ? (
            <p className="text-sm font-medium text-red-700" role="alert">
              {error}
            </p>
          ) : null}
          <ButtonPrimary
            disabled={isSubmitting}
            onClick={createCheckout}
            type="button"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="animate-spin" />
                Loading...
              </>
            ) : (
              "Continue"
            )}
          </ButtonPrimary>
          <p className="text-center text-xs text-zinc-500">
            Payment is securely processed by Stripe.
          </p>
        </>
      ) : null}

      {view === "checking" ? (
        <DonationStatus
          icon={<LoaderCircle className="size-9 animate-spin text-zinc-700" />}
          heading="Checking your donation"
          message="Confirming the payment status with Stripe."
        />
      ) : null}

      {view === "success" ? (
        <DonationStatus
          icon={<CheckCircle2 className="size-9 text-emerald-600" />}
          heading="Thank you for your support"
          message="Your donation was completed successfully."
        >
          <ButtonPrimary onClick={onClose} type="button">
            Done
          </ButtonPrimary>
        </DonationStatus>
      ) : null}

      {view === "canceled" ? (
        <DonationStatus
          icon={<CircleX className="size-9 text-zinc-500" />}
          heading="Donation canceled"
          message="You were not charged. You can choose another amount or try again."
        >
          <ButtonPrimary onClick={showForm} type="button">
            Try again
          </ButtonPrimary>
          <ButtonSecondary onClick={onClose} type="button">
            Close
          </ButtonSecondary>
        </DonationStatus>
      ) : null}

      {view === "retryable-failure" ? (
        <DonationStatus
          icon={<RefreshCcw className="size-9 text-amber-600" />}
          heading="We could not confirm the donation"
          message={
            error ??
            "Stripe may still be processing the payment. Check again before starting another donation."
          }
        >
          <ButtonPrimary onClick={checkStatus} type="button">
            Check again
          </ButtonPrimary>
          <ButtonSecondary onClick={showForm} type="button">
            Choose an amount
          </ButtonSecondary>
        </DonationStatus>
      ) : null}
    </ModalFrame>
  );
}

async function fetchCheckoutStatusWithRetry(
  sessionId: string,
  options?: { signal?: AbortSignal },
) {
  let lastError: unknown;

  for (
    let attempt = 0;
    attempt <= checkoutStatusRetryDelays.length;
    attempt++
  ) {
    try {
      const status = await fetchCheckoutStatus(sessionId, options);
      if (status !== "retryable-failure") return status;
      lastError = undefined;
    } catch (error) {
      if (isAbortError(error)) throw error;
      lastError = error;
    }

    const delay = checkoutStatusRetryDelays[attempt];
    if (delay !== undefined) {
      await wait(delay, options?.signal);
    }
  }

  if (lastError) throw lastError;
  return "retryable-failure";
}

async function fetchCheckoutStatus(
  sessionId: string,
  options?: { signal?: AbortSignal },
) {
  const params = new URLSearchParams({ sessionId });
  const response = await fetch(`/api/donations/checkout-status?${params}`, {
    signal: options?.signal,
  });
  const detail = (await response.json()) as
    | { status: DonationCheckoutStatus }
    | ApiErrorDetail;

  if (!response.ok || "error" in detail) {
    throw new Error(
      "error" in detail
        ? detail.error.message
        : "We could not verify the donation.",
    );
  }

  return detail.status;
}

function wait(delay: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }

    const timeout = window.setTimeout(resolve, delay);
    signal?.addEventListener(
      "abort",
      () => {
        window.clearTimeout(timeout);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true },
    );
  });
}

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}

function DonationStatus({
  children,
  heading,
  icon,
  message,
}: {
  children?: React.ReactNode;
  heading: string;
  icon: React.ReactNode;
  message: string;
}) {
  return (
    <div className="grid justify-items-center gap-3 py-5 text-center">
      {icon}
      <div className="grid gap-1">
        <h4 className="text-lg font-bold text-zinc-950">{heading}</h4>
        <p className="max-w-md text-sm leading-6 text-zinc-600">{message}</p>
      </div>
      {children ? (
        <div className="mt-2 flex w-full flex-col gap-2 sm:w-auto sm:min-w-52">
          {children}
        </div>
      ) : null}
    </div>
  );
}
