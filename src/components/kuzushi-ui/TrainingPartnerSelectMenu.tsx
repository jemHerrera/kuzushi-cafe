"use client";

import { Check, UserPlus, UserRound } from "lucide-react";
import { useId, useMemo, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "./Avatar";
import {
  SearchSelectPopover,
  searchSelectOptionClassName,
} from "./SearchSelectPopover";
import {
  beltBorderStyles,
  cx,
  initialsForPartner,
  samplePartners,
  type Partner,
} from "./shared";

type TrainingPartnerSelectMenuProps = {
  partners?: Partner[];
  value?: Partner | null;
  placeholder?: string;
  ariaLabel?: string;
  onSelectPartner?: (partner: Partner) => void;
  onSelectUnknownPartner?: () => void;
  onAddCustomPartner?: () => void;
  variant?: "default" | "property" | "table";
  disabled?: boolean;
};

export function TrainingPartnerSelectMenu({
  partners = samplePartners,
  value,
  placeholder = "Add training partner (optional)",
  ariaLabel,
  onSelectPartner,
  onSelectUnknownPartner,
  onAddCustomPartner,
  variant = "default",
  disabled = false,
}: TrainingPartnerSelectMenuProps) {
  const listboxId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [internalSelectedPartner, setInternalSelectedPartner] =
    useState<Partner | null>(value ?? null);
  const [isUnknownSelected, setIsUnknownSelected] = useState(false);
  const selectedPartner = value !== undefined ? value : internalSelectedPartner;
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const trimmedQuery = query.trim();
  const visiblePartners = useMemo(
    () => rankPartners(partners, trimmedQuery),
    [partners, trimmedQuery],
  );
  const showUnknownPartner =
    !trimmedQuery || scoreText("Unknown Partner", trimmedQuery) !== null;
  const unknownOptionCount = showUnknownPartner ? 1 : 0;
  const canAddCustomPartner = trimmedQuery.length > 0;
  const addCustomPartnerIndex = unknownOptionCount + visiblePartners.length;
  const optionCount = addCustomPartnerIndex + (canAddCustomPartner ? 1 : 0);

  function openMenu() {
    setIsOpen(true);
    setActiveIndex(0);
  }

  function selectUnknownPartner() {
    setInternalSelectedPartner(null);
    setIsUnknownSelected(true);
    setQuery("");
    setIsOpen(false);
    onSelectUnknownPartner?.();
  }

  function selectPartner(partner: Partner) {
    setInternalSelectedPartner(partner);
    setIsUnknownSelected(false);
    setQuery("");
    setIsOpen(false);
    onSelectPartner?.(partner);
  }

  function addCustomPartner() {
    setIsOpen(false);
    onAddCustomPartner?.();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setIsOpen(false);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, optionCount - 1));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
      return;
    }

    if (event.key !== "Enter") return;

    event.preventDefault();
    if (showUnknownPartner && activeIndex === 0) {
      selectUnknownPartner();
      return;
    }

    const partnerIndex = activeIndex - unknownOptionCount;
    const partner = visiblePartners[partnerIndex];
    if (partner) {
      selectPartner(partner);
      return;
    }

    if (canAddCustomPartner && activeIndex === addCustomPartnerIndex) {
      addCustomPartner();
    }
  }

  const selectedLabel = isUnknownSelected
    ? "Unknown Partner"
    : selectedPartner
      ? getPartnerLabel(selectedPartner)
      : placeholder;
  const isPlaceholderVisible = !isUnknownSelected && !selectedPartner;

  return (
    <SearchSelectPopover
      open={isOpen}
      onOpenChange={setIsOpen}
      listboxId={listboxId}
      searchLabel={`Search ${ariaLabel ?? "training partners"}`}
      searchPlaceholder="Search by name"
      searchValue={query}
      mobileTitle={ariaLabel ?? "Training partner"}
      onSearchChange={(event) => {
        setQuery(event.target.value);
        setActiveIndex(0);
      }}
      onSearchKeyDown={handleKeyDown}
      trigger={
        <button
          type="button"
          disabled={disabled}
          aria-label={ariaLabel ? `${ariaLabel}: ${selectedLabel}` : undefined}
          aria-controls={isOpen ? listboxId : undefined}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          className={cn(
            "flex min-h-11 w-full items-center justify-between gap-3 rounded-md border border-zinc-200 bg-white px-3 py-2 text-left text-sm text-zinc-900 shadow-sm transition hover:bg-zinc-50 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
            variant === "property" &&
              "min-h-10 border-transparent bg-transparent px-2 py-1 shadow-none hover:bg-zinc-100 focus-visible:border-transparent focus-visible:ring-2",
            variant === "table" &&
              "min-h-8 justify-start border-transparent bg-transparent px-1 py-0 shadow-none hover:bg-zinc-50 focus-visible:border-transparent focus-visible:ring-0",
          )}
          onClick={openMenu}
        >
          {selectedPartner && variant === "table" ? (
            <PartnerAvatar partner={selectedPartner} compact />
          ) : null}
          <span
            className={cn(
              "min-w-0 flex-1 truncate",
              isPlaceholderVisible && "text-muted-foreground",
            )}
          >
            {selectedLabel}
          </span>
          {selectedPartner && variant !== "table" ? (
            <PartnerAvatar partner={selectedPartner} />
          ) : null}
        </button>
      }
    >
      {showUnknownPartner ? (
        <button
          type="button"
          role="option"
          aria-selected={isUnknownSelected}
          className={cx(
            searchSelectOptionClassName,
            activeIndex === 0 && "bg-zinc-100",
          )}
          onMouseEnter={() => setActiveIndex(0)}
          onClick={selectUnknownPartner}
        >
          <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
            <UserRound className="size-4" />
          </span>
          <span className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-900">
            Unknown Partner
          </span>
          {isUnknownSelected ? (
            <Check className="size-4 shrink-0 text-zinc-600" />
          ) : null}
        </button>
      ) : null}

      {visiblePartners.map((partner, index) => {
        const optionIndex = unknownOptionCount + index;
        const isSelected =
          selectedPartner !== null &&
          getPartnerLabel(selectedPartner) === getPartnerLabel(partner);

        return (
          <button
            key={`${partner.firstName}-${partner.lastName}`}
            type="button"
            role="option"
            aria-selected={isSelected}
            className={cx(
              searchSelectOptionClassName,
              activeIndex === optionIndex && "bg-zinc-100",
            )}
            onMouseEnter={() => setActiveIndex(optionIndex)}
            onClick={() => selectPartner(partner)}
          >
            <PartnerAvatar partner={partner} />
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-900">
              {getPartnerLabel(partner)}
            </span>
            {isSelected ? (
              <Check className="size-4 shrink-0 text-zinc-600" />
            ) : null}
          </button>
        );
      })}

      {canAddCustomPartner ? (
        <button
          type="button"
          role="option"
          aria-selected={false}
          className={cx(
            searchSelectOptionClassName,
            activeIndex === addCustomPartnerIndex && "bg-zinc-100",
          )}
          onMouseEnter={() => setActiveIndex(addCustomPartnerIndex)}
          onClick={addCustomPartner}
        >
          <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
            <UserPlus className="size-4" />
          </span>
          <span className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-900">
            Add &quot;{trimmedQuery}&quot;
          </span>
        </button>
      ) : null}
    </SearchSelectPopover>
  );
}

function PartnerAvatar({
  partner,
  compact = false,
}: {
  partner: Partner;
  compact?: boolean;
}) {
  return (
    <span
      className={cx(
        "inline-flex shrink-0 rounded-full p-0",
        compact ? "border-2" : "border-[3px]",
        beltBorderStyles[partner.belt ?? "unknown"],
      )}
    >
      <Avatar
        initials={initialsForPartner(partner)}
        src={partner.profilePhoto}
        size="xs"
      />
    </span>
  );
}

function rankPartners(partners: Partner[], query: string) {
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) return partners;

  return partners
    .map((partner) => ({
      partner,
      score: scorePartner(partner, normalizedQuery),
    }))
    .filter(
      (result): result is { partner: Partner; score: number } =>
        result.score !== null,
    )
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;

      return getPartnerLabel(left.partner).localeCompare(
        getPartnerLabel(right.partner),
      );
    })
    .map((result) => result.partner);
}

function scorePartner(partner: Partner, normalizedQuery: string) {
  const fullName = getPartnerLabel(partner);
  const initials = `${partner.firstName?.[0] ?? ""}${partner.lastName?.[0] ?? ""}`;
  const searchableValues = [fullName, initials];

  return searchableValues.reduce<number | null>((bestScore, value) => {
    const score = scoreText(value, normalizedQuery);
    if (score === null) return bestScore;

    return bestScore === null ? score : Math.max(bestScore, score);
  }, null);
}

function scoreText(value: string, query: string) {
  const normalizedValue = normalize(value);
  const normalizedQuery = normalize(query);

  if (normalizedValue === normalizedQuery) return 120;
  if (normalizedValue.startsWith(normalizedQuery)) return 100;
  if (normalizedValue.includes(normalizedQuery)) return 80;

  const orderedMatchScore = scoreOrderedMatch(normalizedValue, normalizedQuery);
  if (orderedMatchScore !== null) return orderedMatchScore;

  return null;
}

function scoreOrderedMatch(value: string, query: string) {
  let cursor = 0;
  let score = 0;

  for (const character of query) {
    const index = value.indexOf(character, cursor);
    if (index === -1) return null;

    score += index === cursor ? 4 : 1;
    cursor = index + 1;
  }

  return score;
}

function getPartnerLabel(partner: Partner) {
  const label = [partner.firstName, partner.lastName].filter(Boolean).join(" ");
  return label || "Unknown Partner";
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}
