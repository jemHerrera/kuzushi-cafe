"use client";

import {
  CalendarDays,
  CircleCheck,
  NotebookPen,
  Plus,
  Route,
  Shapes,
  Tag,
  Trash2,
  UserRound,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { useEffect, useId, useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import type { ApiErrorDetail, TechniqueTagDetail } from "@/lib/managers/types";
import { AlertBanner } from "./AlertBanner";
import { ButtonPrimary } from "./ButtonPrimary";
import { ButtonSecondary } from "./ButtonSecondary";
import { DateSelector } from "./DateSelector";
import { DestructiveConfirmDialog } from "./DestructiveConfirmDialog";
import { ErrorState } from "./ErrorState";
import { useJournalFormOptions } from "./JournalFormOptionsProvider";
import { ModalFrame } from "./ModalFrame";
import { PropertyField } from "./PropertyField";
import { TechniqueCategoryPillSelect } from "./TechniqueCategoryPillSelect";
import { TechniqueTagSelectMenu } from "./TechniqueTagSelectMenu";
import { TrainingPartnerInput } from "./TrainingPartnerInput";
import {
  initialsForPartner,
  type Category,
  type JournalEntry,
  type JournalType,
  type Partner,
  type Technique,
  type TrainingPartnerDetail,
} from "./shared";

export function JournalEntryForm({
  mode,
  entry,
  onClose,
  onSaved,
  onDeleted,
  withinDialog = false,
}: {
  mode: "create" | "update";
  entry?: JournalEntry;
  onClose?: () => void;
  onSaved?: () => void;
  onDeleted?: () => void;
  withinDialog?: boolean;
}) {
  const notesId = useId();
  const [category, setCategory] = useState<Category>(
    entry?.category ?? "submission",
  );
  const [techniqueName, setTechniqueName] = useState(entry?.technique ?? "");
  const [setupName, setSetupName] = useState(entry?.setup ?? "");
  const [notes, setNotes] = useState(entry?.notes ?? "");
  const [journalType, setJournalType] = useState<JournalType | "not-specified">(
    entry?.journalType ?? (mode === "create" ? "success" : "not-specified"),
  );
  const [trainedDate, setTrainedDate] = useState<Date | undefined>(() =>
    entry?.trainedDate ? parseISO(entry.trainedDate) : new Date(),
  );
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(
    entry?.partner ?? null,
  );
  const [isPartnerTouched, setIsPartnerTouched] = useState(false);
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const {
    tags,
    partners: loadedPartners,
    isLoading: isOptionsLoading,
    error: optionsError,
    refresh: refreshOptions,
    retry: retryOptions,
    upsertTag,
  } = useJournalFormOptions();
  const tagCategory = category === "tap" ? "submission" : category;
  const techniques = useMemo(
    () =>
      uniqueTechniques(
        tags
          .filter((tag) => tag.category === tagCategory)
          .map((tag) => ({ name: tag.label, category: tag.category })),
      ),
    [tagCategory, tags],
  );
  const setups = useMemo(
    () =>
      uniqueTechniques(
        tags.map((tag) => ({ name: tag.label, category: tag.category })),
      ),
    [tags],
  );
  const partners = useMemo(
    () => loadedPartners.map(toPartner),
    [loadedPartners],
  );

  useEffect(() => {
    refreshOptions();
  }, [refreshOptions]);

  const selectedTechnique = useMemo(
    () =>
      techniqueName ? { name: techniqueName, category: tagCategory } : null,
    [techniqueName, tagCategory],
  );
  const selectedSetup = useMemo(
    () => (setupName ? { name: setupName, category: tagCategory } : null),
    [setupName, tagCategory],
  );

  function selectCategory(nextCategory: Category) {
    setCategory(nextCategory);
    setTechniqueName("");
    if (nextCategory === "tap") {
      setJournalType("not-specified");
    }
  }

  async function submitEntry(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);

    const body: Record<string, unknown> = {
      name: techniqueName,
      category,
      notes: notes || (mode === "update" ? null : undefined),
      ...(trainedDate
        ? { trainedDate: format(trainedDate, "yyyy-MM-dd") }
        : mode === "update"
          ? { trainedDate: null }
          : {}),
      ...(setupName
        ? { setup: setupName }
        : mode === "update"
          ? { setup: null }
          : {}),
      ...(category === "tap"
        ? mode === "update"
          ? { journalType: null }
          : {}
        : journalType !== "not-specified"
          ? { journalType }
          : mode === "update"
            ? { journalType: null }
            : {}),
    };

    if (selectedPartner?.id) {
      body.trainingPartnerId = selectedPartner.id;
    } else if (mode === "update" && isPartnerTouched) {
      body.trainingPartnerId = null;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(
        mode === "create"
          ? "/api/journal-entries"
          : `/api/journal-entries/${entry?.id}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );

      if (!response.ok) {
        const detail = (await response.json()) as ApiErrorDetail;
        throw new Error(detail.error.message);
      }

      onSaved?.();
      onClose?.();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "We could not save this journal entry.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function deleteEntry() {
    if (!entry) return;

    setError(undefined);
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/journal-entries/${entry.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const detail = (await response.json()) as ApiErrorDetail;
        throw new Error(detail.error.message);
      }

      onDeleted?.();
      onClose?.();
    } catch (deleteError) {
      throw new Error(
        deleteError instanceof Error
          ? deleteError.message
          : "We could not delete this journal entry.",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <ModalFrame
      title={mode === "create" ? "Add journal entry" : "Update journal entry"}
      onClose={onClose}
      withinDialog={withinDialog}
      className="p-3 sm:p-5"
    >
      <form className="grid gap-4" onSubmit={submitEntry}>
        {error ? (
          <AlertBanner
            className="border-red-200 bg-red-50 text-red-900"
            message={error}
          />
        ) : null}
        {optionsError ? (
          <ErrorState message={optionsError} onRetry={retryOptions} />
        ) : null}
        <>
          <PropertyField icon={Shapes} label="Category">
            <TechniqueCategoryPillSelect
              disabled={isSubmitting || isDeleting}
              value={category}
              onValueChange={selectCategory}
              variant="property"
            />
          </PropertyField>
          <PropertyField icon={Tag} label="Technique">
            <TechniqueTagSelectMenu
              category={tagCategory}
              disabled={isSubmitting || isDeleting}
              techniques={techniques}
              value={selectedTechnique}
              ariaLabel="Technique"
              onSelectTechnique={(technique) => {
                setTechniqueName(technique.name);
              }}
              onCreateSavedTag={async (input) => {
                const tag = await createTechniqueTag(input);
                upsertTag(tag);
                const technique = { name: tag.label, category: tag.category };
                return technique;
              }}
              variant="property"
            />
          </PropertyField>
          <PropertyField
            icon={Route}
            label="Setup"
            description="Describe how you got to the technique, including positions, entries, or transitions that set it up."
            descriptionLabel="What is setup?"
          >
            <TechniqueTagSelectMenu
              ariaLabel="Setup"
              category={tagCategory}
              disabled={isSubmitting || isDeleting}
              techniques={setups}
              value={selectedSetup}
              placeholder="Add setup (optional)"
              variant="property"
              onSelectTechnique={(technique) => {
                setSetupName(technique.name);
              }}
              onCreateSavedTag={async (input) => {
                const tag = await createTechniqueTag(input);
                upsertTag(tag);
                const technique = { name: tag.label, category: tag.category };
                return technique;
              }}
            />
          </PropertyField>
          <PropertyField
            icon={NotebookPen}
            label="Notes"
            description="Include what worked, what failed, adjustments to try, and details you want to remember next time."
            descriptionLabel="What should I include in notes?"
            htmlFor={notesId}
          >
            <Textarea
              id={notesId}
              className="min-h-10 resize-none border-transparent bg-transparent px-2 py-2 text-sm shadow-none hover:bg-zinc-100 focus-visible:border-transparent focus-visible:bg-zinc-100 focus-visible:ring-0"
              placeholder="Add notes (optional)"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              disabled={isSubmitting || isDeleting}
            />
          </PropertyField>
          <PropertyField icon={CalendarDays} label="Trained date">
            <DateSelector
              ariaLabel="Trained date"
              value={trainedDate}
              onValueChange={setTrainedDate}
              disabled={isSubmitting || isDeleting}
              disableFuture
              variant="property"
            />
          </PropertyField>
          <PropertyField icon={UserRound} label="Partner">
            <TrainingPartnerInput
              ariaLabel="Select training partner"
              disabled={isSubmitting || isDeleting}
              partners={partners}
              value={selectedPartner}
              onSelectPartner={(partner) => {
                setSelectedPartner(partner);
                setIsPartnerTouched(true);
              }}
              onSelectUnknownPartner={() => {
                setSelectedPartner(null);
                setIsPartnerTouched(true);
              }}
              showLabel={false}
              variant="property"
            />
          </PropertyField>
          {category !== "tap" ? (
            <PropertyField icon={CircleCheck} label="Type">
              <RadioGroup
                aria-label="Type"
                className="flex min-h-8 flex-wrap items-center gap-1"
                name="type"
                value={journalType}
                onValueChange={(value) =>
                  setJournalType(value as JournalType | "not-specified")
                }
                disabled={isSubmitting || isDeleting}
              >
                <Label className="cursor-pointer min-h-10 rounded-md px-2 py-1 font-normal text-zinc-700 transition has-[[data-state=checked]]:text-zinc-950">
                  <RadioGroupItem
                    className="size-3.5 shadow-none cursor-pointer"
                    value="attempt"
                  />
                  Attempt
                </Label>
                <Label className="cursor-pointer min-h-10 rounded-md px-2 py-1 font-normal text-zinc-700 transition has-[[data-state=checked]]:text-zinc-950">
                  <RadioGroupItem
                    className="size-3.5 shadow-none cursor-pointer"
                    value="success"
                  />
                  Success
                </Label>
              </RadioGroup>
            </PropertyField>
          ) : null}
          <div className="flex flex-wrap justify-between gap-3">
            {mode === "update" ? (
              <DestructiveConfirmDialog
                actionLabel="Delete entry"
                description="This journal entry will be permanently removed. This action cannot be undone."
                disabled={isSubmitting || isDeleting}
                onConfirm={deleteEntry}
                onPendingChange={setIsDeleting}
                pendingLabel="Deleting..."
                title="Delete this journal entry?"
              >
                <ButtonSecondary
                  className="text-red-700 hover:bg-red-100 hover:text-red-800 border-none bg-none"
                  disabled={isSubmitting || isDeleting}
                  type="button"
                >
                  <Trash2 className="size-4" />
                </ButtonSecondary>
              </DestructiveConfirmDialog>
            ) : (
              <span />
            )}
            <ButtonPrimary
              type="submit"
              disabled={isSubmitting || isDeleting || !techniqueName.trim()}
            >
              <Plus className="size-4" />
              {isSubmitting
                ? mode === "create"
                  ? "Adding..."
                  : "Saving..."
                : mode === "create"
                  ? "Add entry"
                  : "Save changes"}
            </ButtonPrimary>
          </div>
        </>
      </form>
    </ModalFrame>
  );
}

function toPartner(partner: TrainingPartnerDetail): Partner {
  return {
    id: partner.id,
    accountId:
      partner.object === "training_partner" ? partner.accountId : undefined,
    firstName: partner.firstName,
    lastName: partner.lastName,
    initials: initialsForPartner(partner),
    profilePhoto:
      partner.object === "training_partner" ? partner.profilePhoto : undefined,
    belt: partner.belt,
    weight: partner.weight,
    age: partner.object === "custom_training_partner" ? partner.age : undefined,
  };
}

async function createTechniqueTag(input: {
  label: string;
  category: Category;
}) {
  const response = await fetch("/api/technique-tags", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    const detail = (await response.json()) as ApiErrorDetail;
    throw new Error(detail.error.message);
  }
  return (await response.json()) as TechniqueTagDetail;
}

function uniqueTechniques(techniques: Technique[]) {
  const seen = new Set<string>();
  return techniques.filter((technique) => {
    const key = `${technique.category}:${technique.name.trim().toLocaleLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
