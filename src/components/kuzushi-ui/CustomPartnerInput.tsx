"use client";

import {
  ArrowLeft,
  Award,
  CalendarClock,
  Plus,
  Scale,
  UserRound,
  X,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type {
  AgeClass,
  ApiErrorDetail,
  Belt,
  TrainingPartnerDetail,
  WeightClass,
} from "@/lib/managers/types";
import { AlertBanner } from "./AlertBanner";
import { ButtonPrimary } from "./ButtonPrimary";
import { ModalFrame } from "./ModalFrame";
import { PropertyField } from "./PropertyField";
import {
  ageClasses,
  belts,
  formatAgeClassOption,
  formatBelt,
  formatWeightClassOption,
  SelectInput,
  TextInput,
  weightClasses,
} from "./shared";

export function CustomPartnerInput({
  onBack,
  onClose,
  onCreated,
  presentation = "modal",
  withinDialog = false,
}: {
  onBack?: () => void;
  onClose?: () => void;
  onCreated?: (partner: TrainingPartnerDetail) => void;
  presentation?: "modal" | "sheet";
  withinDialog?: boolean;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [partnerWeight, setPartnerWeight] = useState<WeightClass>("unknown");
  const [partnerAge, setPartnerAge] = useState<AgeClass>("unknown");
  const [partnerBelt, setPartnerBelt] = useState<Belt>("unknown");
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitPartner(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);

    const body = {
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      partnerWeight,
      partnerAge,
      partnerBelt,
    };

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/training-partners/custom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const detail = (await response.json()) as ApiErrorDetail;
        throw new Error(detail.error.message);
      }

      onCreated?.((await response.json()) as TrainingPartnerDetail);
      onBack?.();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "We could not add this custom partner.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const content = (
    <>
      <button
        className="inline-flex w-fit items-center gap-2 rounded-md text-sm font-semibold text-zinc-700 transition hover:text-zinc-950 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        onClick={onBack}
        type="button"
      >
        <ArrowLeft className="size-4" />
        Back
      </button>
      <form className="grid gap-4" onSubmit={submitPartner}>
        {error ? <AlertBanner message={error} /> : null}
        <div className="grid">
          <PropertyField icon={UserRound} label="First name">
            <TextInput
              aria-label="First name"
              placeholder="Add first name"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              disabled={isSubmitting}
              variant="property"
            />
          </PropertyField>
          <PropertyField icon={UserRound} label="Last name">
            <TextInput
              aria-label="Last name"
              placeholder="Add last name"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              disabled={isSubmitting}
              variant="property"
            />
          </PropertyField>
          <PropertyField icon={Scale} label="Weight">
            <SelectInput
              aria-label="Weight"
              value={partnerWeight}
              onChange={(event) =>
                setPartnerWeight(event.target.value as WeightClass)
              }
              disabled={isSubmitting}
              variant="property"
            >
              {weightClasses.map((weight) => (
                <option key={weight} value={weight}>
                  {formatWeightClassOption(weight)}
                </option>
              ))}
            </SelectInput>
          </PropertyField>
          <PropertyField icon={CalendarClock} label="Age">
            <SelectInput
              aria-label="Age"
              value={partnerAge}
              onChange={(event) =>
                setPartnerAge(event.target.value as AgeClass)
              }
              disabled={isSubmitting}
              variant="property"
            >
              {ageClasses.map((age) => (
                <option key={age} value={age}>
                  {formatAgeClassOption(age)}
                </option>
              ))}
            </SelectInput>
          </PropertyField>
          <PropertyField icon={Award} label="Belt">
            <SelectInput
              aria-label="Belt"
              value={partnerBelt}
              onChange={(event) => setPartnerBelt(event.target.value as Belt)}
              disabled={isSubmitting}
              variant="property"
            >
              {belts.map((belt) => (
                <option key={belt} value={belt}>
                  {formatBelt(belt)}
                </option>
              ))}
            </SelectInput>
          </PropertyField>
        </div>
        <div className="flex justify-end">
          <ButtonPrimary type="submit" disabled={isSubmitting}>
            <Plus className="size-4" />
            {isSubmitting ? "Adding..." : "Add partner"}
          </ButtonPrimary>
        </div>
      </form>
    </>
  );

  if (presentation === "sheet") {
    return (
      <section className="flex h-full min-h-0 flex-col overflow-y-auto bg-white">
        <div className="flex items-center justify-between gap-3 p-4 pb-0">
          <h2 className="text-lg font-bold text-zinc-950">
            Add custom partner
          </h2>
          <Button
            aria-label="Close"
            title="Close"
            type="button"
            variant="ghost"
            size="icon-lg"
            className="rounded-md text-zinc-700"
            onClick={onClose}
          >
            <X className="size-4" />
          </Button>
        </div>
        <div className="grid gap-4 p-4">{content}</div>
      </section>
    );
  }

  return (
    <ModalFrame
      title="Add custom partner"
      onClose={onClose}
      withinDialog={withinDialog}
      className="p-3 sm:p-5"
    >
      {content}
    </ModalFrame>
  );
}
