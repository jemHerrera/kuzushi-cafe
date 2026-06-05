"use client";

import { Check, ChevronDown, UserPlus, UserRound } from "lucide-react";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { Avatar } from "./Avatar";
import { Search } from "./Search";
import {
  beltBorderStyles,
  cx,
  formatAgeClass,
  getPartnerProfileMeta,
  samplePartners,
  type Partner,
} from "./shared";

type TrainingPartnerSelectMenuProps = {
  partners?: Partner[];
  value?: Partner | null;
  placeholder?: string;
  onSelectPartner?: (partner: Partner) => void;
  onSelectUnknownPartner?: () => void;
  onAddCustomPartner?: () => void;
};

export function TrainingPartnerSelectMenu({
  partners = samplePartners,
  value,
  placeholder = "Select partner",
  onSelectPartner,
  onSelectUnknownPartner,
  onAddCustomPartner,
}: TrainingPartnerSelectMenuProps) {
  const listboxId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
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
  const addCustomPartnerIndex = unknownOptionCount + visiblePartners.length;
  const optionCount = addCustomPartnerIndex + 1;

  useEffect(() => {
    if (!isOpen) return;

    window.requestAnimationFrame(() => searchInputRef.current?.focus());
  }, [isOpen]);

  useEffect(() => {
    function closeOnOutsidePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", closeOnOutsidePointerDown);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointerDown);
    };
  }, []);

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

    if (activeIndex === addCustomPartnerIndex) {
      addCustomPartner();
    }
  }

  const selectedLabel = isUnknownSelected
    ? "Unknown Partner"
    : selectedPartner
      ? getPartnerLabel(selectedPartner)
      : placeholder;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-controls={isOpen ? listboxId : undefined}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="flex min-h-11 w-full items-center justify-between gap-3 rounded-md border border-zinc-200 bg-white px-3 py-2 text-left text-sm text-zinc-900 shadow-sm transition hover:bg-zinc-50 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        onClick={openMenu}
      >
        <span className="min-w-0 flex-1 truncate font-medium">
          {selectedLabel}
        </span>
        {selectedPartner ? <PartnerAvatar partner={selectedPartner} /> : null}
        <ChevronDown className="size-4 shrink-0 text-zinc-500" />
      </button>

      {isOpen ? (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-lg border border-zinc-200 bg-white p-3 shadow-lg">
          <Search
            ref={searchInputRef}
            aria-controls={listboxId}
            aria-expanded={isOpen}
            autoComplete="off"
            placeholder="Search by first name, last name, weight, or age"
            role="combobox"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleKeyDown}
          />
          <div
            id={listboxId}
            role="listbox"
            className="mt-3 grid max-h-72 gap-2 overflow-y-auto"
          >
            {showUnknownPartner ? (
              <button
                type="button"
                role="option"
                aria-selected={isUnknownSelected}
                className={cx(
                  "flex min-h-10 items-center gap-3 rounded-md border border-zinc-200 px-3 py-1.5 text-left hover:bg-zinc-50",
                  activeIndex === 0 && "bg-zinc-50",
                )}
                onMouseEnter={() => setActiveIndex(0)}
                onClick={selectUnknownPartner}
              >
                <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 ring-1 ring-zinc-200">
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
                    "flex min-h-10 items-center gap-3 rounded-md border border-zinc-200 px-3 py-1.5 text-left hover:bg-zinc-50",
                    activeIndex === optionIndex && "bg-zinc-50",
                  )}
                  onMouseEnter={() => setActiveIndex(optionIndex)}
                  onClick={() => selectPartner(partner)}
                >
                  <PartnerAvatar partner={partner} />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-900">
                    {getPartnerLabel(partner)}
                  </span>
                  <span className="shrink-0 text-xs font-semibold text-zinc-500">
                    {getPartnerProfileMeta(partner)}
                  </span>
                  {isSelected ? (
                    <Check className="size-4 shrink-0 text-zinc-600" />
                  ) : null}
                </button>
              );
            })}

            <button
              type="button"
              role="option"
              aria-selected={false}
              className={cx(
                "flex min-h-10 items-center gap-3 rounded-md border border-dashed border-zinc-300 px-3 py-1.5 text-left hover:bg-zinc-50",
                activeIndex === addCustomPartnerIndex && "bg-zinc-50",
              )}
              onMouseEnter={() => setActiveIndex(addCustomPartnerIndex)}
              onClick={addCustomPartner}
            >
              <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 ring-1 ring-zinc-200">
                <UserPlus className="size-4" />
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-900">
                Add custom partner
              </span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function PartnerAvatar({ partner }: { partner: Partner }) {
  return (
    <span
      className={cx(
        "inline-flex shrink-0 rounded-full border-[3px] p-0",
        beltBorderStyles[partner.belt],
      )}
    >
      <Avatar initials={partner.initials} size="xs" />
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
  const initials = `${partner.firstName[0] ?? ""}${partner.lastName[0] ?? ""}`;
  const searchableValues = [
    fullName,
    initials,
    partner.weight,
    formatAgeClass(partner.age),
  ];

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
  return `${partner.firstName} ${partner.lastName}`;
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}
