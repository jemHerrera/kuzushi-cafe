"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TechniqueCategoryPillSelect } from "./TechniqueCategoryPillSelect";
import type { Category } from "./shared";

export type AggregateTimeline = "week" | "month" | "year" | "all";
export type AggregateTypeFilter = "attempt" | "success" | "all";

type AggregateViewFiltersProps = {
  category?: Category;
  timeline?: AggregateTimeline;
  typeFilter?: AggregateTypeFilter;
  onCategoryChange?: (category: Category) => void;
  onTimelineChange?: (timeline: AggregateTimeline) => void;
  onTypeFilterChange?: (typeFilter: AggregateTypeFilter) => void;
};

const timelineOptions: Array<{
  value: AggregateTimeline;
  label: string;
}> = [
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
  { value: "year", label: "This year" },
  { value: "all", label: "All time" },
];

const typeOptions: Array<{
  value: AggregateTypeFilter;
  label: string;
}> = [
  { value: "all", label: "All" },
  { value: "attempt", label: "Attempts Only" },
  { value: "success", label: "Success Only" },
];

export function AggregateViewFilters({
  category,
  timeline,
  typeFilter,
  onCategoryChange,
  onTimelineChange,
  onTypeFilterChange,
}: AggregateViewFiltersProps = {}) {
  const [internalCategory, setInternalCategory] =
    useState<Category>("submission");
  const [internalTimeline, setInternalTimeline] =
    useState<AggregateTimeline>("month");
  const [internalTypeFilter, setInternalTypeFilter] =
    useState<AggregateTypeFilter>("all");
  const currentCategory = category ?? internalCategory;
  const currentTimeline = timeline ?? internalTimeline;
  const currentTypeFilter =
    currentCategory === "tap" ? "all" : (typeFilter ?? internalTypeFilter);

  function changeCategory(nextCategory: Category) {
    if (category === undefined) setInternalCategory(nextCategory);
    if (nextCategory === "tap") {
      if (typeFilter === undefined) setInternalTypeFilter("all");
      onTypeFilterChange?.("all");
    }
    onCategoryChange?.(nextCategory);
  }

  function changeTimeline(nextTimeline: AggregateTimeline) {
    if (timeline === undefined) setInternalTimeline(nextTimeline);
    onTimelineChange?.(nextTimeline);
  }

  function changeTypeFilter(nextTypeFilter: AggregateTypeFilter) {
    if (typeFilter === undefined) setInternalTypeFilter(nextTypeFilter);
    onTypeFilterChange?.(nextTypeFilter);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <TechniqueCategoryPillSelect
        value={currentCategory}
        onValueChange={changeCategory}
      />
      <FilterSelect
        ariaLabel="Aggregate timeline"
        options={timelineOptions}
        value={currentTimeline}
        onValueChange={(value) => changeTimeline(value as AggregateTimeline)}
      />
      <FilterSelect
        ariaLabel="Aggregate type"
        disabled={currentCategory === "tap"}
        options={typeOptions}
        value={currentTypeFilter}
        onValueChange={(value) =>
          changeTypeFilter(value as AggregateTypeFilter)
        }
      />
    </div>
  );
}

function FilterSelect({
  ariaLabel,
  disabled = false,
  options,
  value,
  onValueChange,
}: {
  ariaLabel: string;
  disabled?: boolean;
  options: Array<{ value: string; label: string }>;
  value: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <Select disabled={disabled} value={value} onValueChange={onValueChange}>
      <SelectTrigger
        aria-label={ariaLabel}
        className="h-8 w-fit min-w-32 rounded-full px-3 text-xs font-semibold shadow-none"
      >
        <SelectValue />
        <ChevronDown className="size-3.5 shrink-0 text-zinc-500" />
      </SelectTrigger>
      <SelectContent align="start" position="popper">
        {options.map((option) => (
          <SelectItem
            key={option.value}
            className="cursor-pointer text-sm"
            showIndicator={false}
            value={option.value}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
