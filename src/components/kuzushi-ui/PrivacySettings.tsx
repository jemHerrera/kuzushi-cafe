"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ModalFrame } from "./ModalFrame";

const privacyRows = [
  "Profile",
  "Journal entries",
  "Submissions",
  "Sweeps",
  "Reversals",
  "Back takes",
  "Guard passes",
  "Taps",
] as const;

const visibilityOptions = ["Public", "Partners", "Private"] as const;

type PrivacyRow = (typeof privacyRows)[number];
type Visibility = (typeof visibilityOptions)[number];

export function PrivacySettings({
  onClose,
  withinDialog = false,
}: {
  onClose?: () => void;
  withinDialog?: boolean;
}) {
  const [settings, setSettings] = useState<Record<PrivacyRow, Visibility>>(
    () =>
      Object.fromEntries(privacyRows.map((row) => [row, "Partners"])) as Record<
        PrivacyRow,
        Visibility
      >,
  );

  function updateSetting(row: PrivacyRow, visibility: Visibility) {
    setSettings((current) => ({ ...current, [row]: visibility }));
  }

  return (
    <ModalFrame
      title="Privacy settings"
      onClose={onClose}
      withinDialog={withinDialog}
      className="p-3 sm:p-5"
    >
      <div className="grid gap-1">
        {privacyRows.map((row) => (
          <div
            key={row}
            className="grid min-h-10 gap-2 rounded-md px-2 py-1.5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
          >
            <span className="text-sm font-normal text-zinc-600">{row}</span>
            <RadioGroup
              aria-label={`${row} visibility`}
              className="grid grid-cols-3 gap-1 rounded-md bg-zinc-100 p-1"
              value={settings[row]}
              onValueChange={(value) => updateSetting(row, value as Visibility)}
            >
              {visibilityOptions.map((option) => (
                <Label
                  key={option}
                  className="min-h-8 cursor-pointer justify-center rounded-md px-2 py-1 text-xs font-medium text-zinc-600 transition hover:bg-white/70 has-[[data-state=checked]]:bg-white has-[[data-state=checked]]:text-zinc-950 has-[[data-state=checked]]:shadow-sm"
                >
                  <RadioGroupItem className="sr-only" value={option} />
                  {option}
                </Label>
              ))}
            </RadioGroup>
          </div>
        ))}
      </div>
    </ModalFrame>
  );
}
