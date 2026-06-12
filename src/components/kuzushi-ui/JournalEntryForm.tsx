"use client";

import {
  CalendarDays,
  CircleCheck,
  Gauge,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import type { ApiErrorDetail, PaginatedResponse } from "@/lib/managers/types";
import { AlertBanner } from "./AlertBanner";
import { ButtonPrimary } from "./ButtonPrimary";
import { ButtonSecondary } from "./ButtonSecondary";
import { DateSelector } from "./DateSelector";
import { ModalFrame } from "./ModalFrame";
import { PropertyField } from "./PropertyField";
import { TechniqueCategoryPillSelect } from "./TechniqueCategoryPillSelect";
import { TechniqueTagSelectMenu } from "./TechniqueTagSelectMenu";
import { TrainingPartnerInput } from "./TrainingPartnerInput";
import {
  SelectInput,
  formatIntensity,
  intensities,
  type Category,
  type Intensity,
  type JournalEntry,
  type JournalType,
  type Partner,
  type Technique,
  type TechniqueTagDetail,
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
  const intensityId = useId();
  const [category, setCategory] = useState<Category>(
    entry?.category ?? "submission",
  );
  const [techniqueName, setTechniqueName] = useState(entry?.technique ?? "");
  const [setupName, setSetupName] = useState(entry?.setup ?? "");
  const [notes, setNotes] = useState(entry?.notes ?? "");
  const [intensity, setIntensity] = useState<Intensity | "">(
    entry?.intensity ?? "",
  );
  const [journalType, setJournalType] = useState<JournalType>(
    entry?.journalType ?? "attempt",
  );
  const [trainedDate, setTrainedDate] = useState(() =>
    entry?.trainedDate ? parseISO(entry.trainedDate) : new Date(),
  );
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(
    entry?.partner ?? null,
  );
  const [isPartnerTouched, setIsPartnerTouched] = useState(false);
  const [techniques, setTechniques] = useState<Technique[]>([]);
  const [setups, setSetups] = useState<Technique[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const selectedTechnique = useMemo(
    () => (techniqueName ? { name: techniqueName, category } : null),
    [techniqueName, category],
  );
  const selectedSetup = useMemo(
    () => (setupName ? { name: setupName, category } : null),
    [setupName, category],
  );

  useEffect(() => {
    let isCurrent = true;

    async function loadTechniques() {
      const tagCategory = category === "tap" ? "submission" : category;
      const tags = await loadTechniqueTags(tagCategory);
      if (!isCurrent) return;
      setTechniques(
        uniqueTechniques(
          tags.map((tag) => ({ name: tag.label, category: tag.category })),
        ),
      );
    }

    loadTechniques();
    return () => {
      isCurrent = false;
    };
  }, [category]);

  useEffect(() => {
    let isCurrent = true;

    async function loadSetups() {
      const tags = await loadTechniqueTags();
      if (!isCurrent) return;
      setSetups(
        uniqueTechniques(
          tags.map((tag) => ({ name: tag.label, category: tag.category })),
        ),
      );
    }

    loadSetups();
    return () => {
      isCurrent = false;
    };
  }, []);

  useEffect(() => {
    let isCurrent = true;

    async function loadPartners() {
      const response = await fetch("/api/training-partners?limit=100");
      if (!response.ok) return;

      const data =
        (await response.json()) as PaginatedResponse<TrainingPartnerDetail>;
      if (!isCurrent) return;
      setPartners(
        data.items
          .filter((partner) => partner.object === "training_partner")
          .map(toPartner),
      );
    }

    loadPartners();
    return () => {
      isCurrent = false;
    };
  }, []);

  function selectCategory(nextCategory: Category) {
    setCategory(nextCategory);
    setTechniqueName("");
    if (nextCategory === "tap") {
      setJournalType("attempt");
    }
  }

  async function submitEntry(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);

    const body: Record<string, unknown> = {
      name: techniqueName,
      category,
      setup: setupName,
      notes: notes || undefined,
      intensity: intensity || undefined,
      trainedDate: format(trainedDate, "yyyy-MM-dd"),
      ...(category === "tap"
        ? mode === "update"
          ? { journalType: null }
          : {}
        : { journalType }),
    };

    if (selectedPartner?.id && selectedPartner.accountId) {
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
      setError(
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
        <PropertyField icon={Shapes} label="Category">
          <TechniqueCategoryPillSelect
            value={category}
            onValueChange={selectCategory}
            variant="property"
          />
        </PropertyField>
        <PropertyField icon={Tag} label="Technique">
          <TechniqueTagSelectMenu
            category={category}
            techniques={techniques}
            value={selectedTechnique}
            ariaLabel="Technique"
            onSelectTechnique={(technique) => {
              setTechniqueName(technique.name);
            }}
            onCreateSavedTag={async (input) => {
              const tag = await createTechniqueTag(input);
              const technique = { name: tag.label, category: tag.category };
              setTechniques((current) =>
                uniqueTechniques([...current, technique]),
              );
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
            category={category}
            techniques={setups}
            value={selectedSetup}
            placeholder="Find or add setup"
            variant="property"
            onSelectTechnique={(technique) => {
              setSetupName(technique.name);
            }}
            onCreateSavedTag={async (input) => {
              const tag = await createTechniqueTag(input);
              const technique = { name: tag.label, category: tag.category };
              setSetups((current) => uniqueTechniques([...current, technique]));
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
            placeholder="Add notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            disabled={isSubmitting || isDeleting}
          />
        </PropertyField>
        <PropertyField icon={Gauge} label="Intensity" htmlFor={intensityId}>
          <SelectInput
            id={intensityId}
            value={intensity}
            onChange={(event) => setIntensity(event.target.value as Intensity)}
            disabled={isSubmitting || isDeleting}
            variant="property"
          >
            <option value="">Select intensity</option>
            {intensities.map((item) => (
              <option key={item} value={item}>
                {formatIntensity(item)}
              </option>
            ))}
          </SelectInput>
        </PropertyField>
        <PropertyField icon={CalendarDays} label="Trained date">
          <DateSelector
            ariaLabel="Trained date"
            value={trainedDate}
            onValueChange={(date) => {
              if (date) setTrainedDate(date);
            }}
            disabled={isSubmitting || isDeleting}
            variant="property"
          />
        </PropertyField>
        <PropertyField icon={UserRound} label="Partner">
          <TrainingPartnerInput
            ariaLabel="Select training partner"
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
          <PropertyField icon={CircleCheck} label="Outcome">
            <RadioGroup
              aria-label="Outcome"
              className="flex min-h-8 flex-wrap items-center gap-1"
              name="outcome"
              value={journalType}
              onValueChange={(value) => setJournalType(value as JournalType)}
              disabled={isSubmitting || isDeleting}
            >
              <Label className="cursor-pointer min-h-10 rounded-md px-2 py-1 font-normal text-zinc-700 transition hover:bg-zinc-100 has-[[data-state=checked]]:bg-zinc-100 has-[[data-state=checked]]:text-zinc-950">
                <RadioGroupItem
                  className="size-3.5 shadow-none cursor-pointer"
                  value="attempt"
                />
                Attempt
              </Label>
              <Label className="cursor-pointer min-h-10 rounded-md px-2 py-1 font-normal text-zinc-700 transition hover:bg-zinc-100 has-[[data-state=checked]]:bg-zinc-100 has-[[data-state=checked]]:text-zinc-950">
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
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <ButtonSecondary
                  className="border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800"
                  disabled={isSubmitting || isDeleting}
                  type="button"
                >
                  <Trash2 className="size-4" />
                </ButtonSecondary>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Delete this journal entry?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This journal entry will be permanently removed. This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 text-white hover:bg-red-700"
                    disabled={isDeleting}
                    onClick={(event) => {
                      event.preventDefault();
                      deleteEntry();
                    }}
                  >
                    {isDeleting ? "Deleting..." : "Delete entry"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <span />
          )}
          <ButtonPrimary type="submit" disabled={isSubmitting || isDeleting}>
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
    belt: partner.belt,
    weight: partner.weight,
    age: partner.object === "custom_training_partner" ? partner.age : undefined,
  };
}

async function loadTechniqueTags(category?: Category) {
  const pageSize = 100;
  const tags: TechniqueTagDetail[] = [];

  for (let offset = 0; ; offset += pageSize) {
    const params = new URLSearchParams({
      limit: String(pageSize),
      offset: String(offset),
    });
    if (category) params.set("category", category);

    const response = await fetch(`/api/technique-tags?${params}`);
    if (!response.ok) return tags;

    const data =
      (await response.json()) as PaginatedResponse<TechniqueTagDetail>;
    tags.push(...data.items);
    if (data.items.length < pageSize) return tags;
  }
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
