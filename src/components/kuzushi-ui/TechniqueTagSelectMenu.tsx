"use client";

import { Check, Plus } from "lucide-react";
import { useId, useMemo, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import {
  SearchSelectPopover,
  searchSelectOptionClassName,
} from "./SearchSelectPopover";
import { cx, sampleTechniques, type Technique } from "./shared";

type TechniqueTagSelectMenuProps = {
  techniques?: Technique[];
  search?: string;
  value?: Technique | null;
  placeholder?: string;
  ariaLabel?: string;
  variant?: "default" | "property" | "table";
  onSelectTechnique?: (technique: Technique) => void;
  onCreateSavedTag?: (label: string) => void;
};

export function TechniqueTagSelectMenu({
  techniques = sampleTechniques,
  search = "",
  value,
  placeholder = "Select technique",
  ariaLabel,
  variant = "default",
  onSelectTechnique,
  onCreateSavedTag,
}: TechniqueTagSelectMenuProps) {
  const listboxId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [internalSelectedTechnique, setInternalSelectedTechnique] =
    useState<Technique | null>(value ?? null);
  const selectedTechnique =
    value !== undefined ? value : internalSelectedTechnique;
  const [query, setQuery] = useState(search);
  const [activeIndex, setActiveIndex] = useState(0);
  const trimmedQuery = query.trim();
  const visibleTechniques = useMemo(
    () => rankTechniques(techniques, trimmedQuery),
    [techniques, trimmedQuery],
  );
  const hasExactMatch = visibleTechniques.some(
    (technique) => normalize(technique.name) === normalize(trimmedQuery),
  );
  const canAdd = trimmedQuery.length > 0 && !hasExactMatch;
  const optionCount = visibleTechniques.length + (canAdd ? 1 : 0);

  function openMenu() {
    setIsOpen(true);
    setActiveIndex(0);
  }

  function selectTechnique(technique: Technique) {
    setInternalSelectedTechnique(technique);
    setQuery("");
    setIsOpen(false);
    onSelectTechnique?.(technique);
  }

  function createSavedTag() {
    if (!trimmedQuery) return;

    onCreateSavedTag?.(trimmedQuery);
    setIsOpen(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setIsOpen(false);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) =>
        Math.min(index + 1, Math.max(optionCount - 1, 0)),
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
      return;
    }

    if (event.key !== "Enter") return;

    event.preventDefault();
    if (activeIndex < visibleTechniques.length) {
      const technique = visibleTechniques[activeIndex];
      if (technique) selectTechnique(technique);
      return;
    }

    if (!canAdd) return;

    if (activeIndex === visibleTechniques.length) {
      createSavedTag();
    }
  }

  return (
    <SearchSelectPopover
      open={isOpen}
      onOpenChange={setIsOpen}
      listboxId={listboxId}
      searchLabel={`Search ${ariaLabel ?? "techniques"}`}
      searchPlaceholder="Search or add technique"
      searchValue={query}
      onSearchChange={(event) => {
        setQuery(event.target.value);
        setActiveIndex(0);
      }}
      onSearchKeyDown={handleKeyDown}
      trigger={
        <button
          type="button"
          aria-label={`${ariaLabel ?? "Technique"}: ${selectedTechnique?.name ?? placeholder}`}
          aria-controls={isOpen ? listboxId : undefined}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          className={cn(
            "flex min-h-11 w-full items-center justify-between gap-3 rounded-md border border-zinc-200 bg-white px-3 py-2 text-left text-sm text-zinc-900 shadow-sm transition hover:bg-zinc-50 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
            variant === "property" &&
              "min-h-10 border-transparent bg-transparent px-2 py-1 shadow-none hover:bg-zinc-100 focus-visible:border-transparent focus-visible:ring-2",
            variant === "table" &&
              "min-h-8 border-transparent bg-transparent px-1 py-0 shadow-none hover:bg-zinc-50 focus-visible:border-transparent focus-visible:ring-0",
          )}
          onClick={openMenu}
        >
          <span className="min-w-0 flex-1 truncate font-medium">
            {selectedTechnique?.name ?? placeholder}
          </span>
        </button>
      }
    >
      {visibleTechniques.map((technique, index) => (
        <button
          key={`${technique.category}-${technique.name}`}
          type="button"
          role="option"
          aria-selected={selectedTechnique?.name === technique.name}
          className={cx(
            searchSelectOptionClassName,
            activeIndex === index && "bg-zinc-100",
          )}
          onMouseEnter={() => setActiveIndex(index)}
          onClick={() => selectTechnique(technique)}
        >
          <span className="min-w-0 flex-1 truncate font-medium text-zinc-900">
            {technique.name}
          </span>
          {selectedTechnique?.name === technique.name ? (
            <Check className="size-4 shrink-0 text-zinc-600" />
          ) : null}
        </button>
      ))}

      {canAdd ? (
        <button
          type="button"
          role="option"
          aria-selected={false}
          className={cx(
            searchSelectOptionClassName,
            activeIndex === visibleTechniques.length && "bg-zinc-100",
          )}
          onMouseEnter={() => setActiveIndex(visibleTechniques.length)}
          onClick={createSavedTag}
        >
          <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
            <Plus className="size-4" />
          </span>
          <span className="min-w-0 flex-1 truncate font-medium text-zinc-900">
            Add &quot;{trimmedQuery}&quot;
          </span>
        </button>
      ) : null}
    </SearchSelectPopover>
  );
}

function rankTechniques(techniques: Technique[], query: string) {
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) return techniques;

  return techniques
    .map((technique) => ({
      technique,
      score: scoreTechnique(technique, normalizedQuery),
    }))
    .filter(
      (result): result is { technique: Technique; score: number } =>
        result.score !== null,
    )
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;

      return left.technique.name.localeCompare(right.technique.name);
    })
    .map((result) => result.technique);
}

function scoreTechnique(technique: Technique, normalizedQuery: string) {
  const normalizedName = normalize(technique.name);
  const normalizedCategory = normalize(technique.category);
  const acronym = technique.name
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .toLowerCase();

  if (normalizedName === normalizedQuery) return 120;
  if (normalizedName.startsWith(normalizedQuery)) return 100;
  if (acronym.startsWith(normalizedQuery)) return 90;
  if (normalizedName.includes(normalizedQuery)) return 80;
  if (normalizedCategory.includes(normalizedQuery)) return 50;

  const orderedMatchScore = scoreOrderedMatch(normalizedName, normalizedQuery);
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

function normalize(value: string) {
  return value.trim().toLowerCase();
}
