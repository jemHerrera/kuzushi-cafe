"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type {
  AccountPrivacySettings,
  ApiErrorDetail,
  PrivacyType,
} from "@/lib/managers/types";
import { AlertBanner } from "./AlertBanner";
import { ButtonPrimary } from "./ButtonPrimary";
import { ErrorState } from "./ErrorState";
import { LoadingState } from "./LoadingState";
import { ModalFrame } from "./ModalFrame";

const privacyRows = [
  ["journalEntries", "Journal entries"],
  ["activity", "Activity"],
  ["stats", "Stats"],
] as const;

const visibilityOptions = [
  ["public", "Public"],
  ["training-partners", "Partners"],
  ["private", "Private"],
] as const;

type PrivacyKey = (typeof privacyRows)[number][0];
type PrivacySettingsValue = Record<PrivacyKey, PrivacyType>;

const defaultSettings = Object.fromEntries(
  privacyRows.map(([key]) => [key, "training-partners"]),
) as PrivacySettingsValue;

export function PrivacySettings({
  onClose,
  withinDialog = false,
}: {
  onClose?: () => void;
  withinDialog?: boolean;
}) {
  const [settings, setSettings] =
    useState<PrivacySettingsValue>(defaultSettings);
  const [error, setError] = useState<string>();
  const [loadError, setLoadError] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [retryToken, setRetryToken] = useState(0);

  useEffect(() => {
    let isActive = true;

    async function loadSettings() {
      setLoadError(undefined);
      try {
        const response = await fetch("/api/account/privacy");
        if (!response.ok) {
          const detail = (await response.json()) as ApiErrorDetail;
          throw new Error(detail.error.message);
        }

        const loaded = (await response.json()) as AccountPrivacySettings;
        if (!isActive) return;
        setSettings({
          journalEntries: loaded.journalEntries,
          activity: loaded.activity,
          stats: loaded.stats,
        });
      } catch (loadError) {
        if (!isActive) return;
        setLoadError(
          loadError instanceof Error
            ? loadError.message
            : "We could not load privacy settings.",
        );
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    loadSettings();

    return () => {
      isActive = false;
    };
  }, [retryToken]);

  function updateSetting(key: PrivacyKey, visibility: PrivacyType) {
    setSettings((current) => ({ ...current, [key]: visibility }));
  }

  async function submitSettings(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/account/privacy", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        const detail = (await response.json()) as ApiErrorDetail;
        throw new Error(detail.error.message);
      }

      toast.success("Privacy settings saved.");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "We could not save privacy settings.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ModalFrame
      title="Privacy settings"
      onClose={onClose}
      withinDialog={withinDialog}
      className="p-3 sm:p-5"
    >
      {isLoading ? (
        <LoadingState
          label="Loading privacy settings"
          rows={5}
          variant="form"
        />
      ) : loadError ? (
        <ErrorState
          message={loadError}
          onRetry={() => setRetryToken((token) => token + 1)}
        />
      ) : (
        <form className="grid gap-4" onSubmit={submitSettings}>
          {error ? <AlertBanner message={error} /> : null}
          <div className="grid gap-1">
            {privacyRows.map(([key, label]) => (
              <div
                key={key}
                className="grid min-h-10 gap-2 rounded-md px-2 py-1.5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
              >
                <span className="text-sm font-normal text-zinc-600">
                  {label}
                </span>
                <RadioGroup
                  aria-label={`${label} visibility`}
                  className="grid grid-cols-3 gap-1 rounded-md bg-zinc-100 p-1"
                  value={settings[key]}
                  disabled={isSubmitting}
                  onValueChange={(value) =>
                    updateSetting(key, value as PrivacyType)
                  }
                >
                  {visibilityOptions.map(([value, optionLabel]) => (
                    <Label
                      key={value}
                      className="min-h-8 cursor-pointer justify-center rounded-md px-2 py-1 text-xs font-medium text-zinc-600 transition hover:bg-white/70 has-[[data-state=checked]]:bg-white has-[[data-state=checked]]:text-zinc-950 has-[[data-state=checked]]:shadow-sm"
                    >
                      <RadioGroupItem
                        className="sr-only"
                        disabled={isSubmitting}
                        value={value}
                      />
                      {optionLabel}
                    </Label>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <ButtonPrimary type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save settings"}
            </ButtonPrimary>
          </div>
        </form>
      )}
    </ModalFrame>
  );
}
