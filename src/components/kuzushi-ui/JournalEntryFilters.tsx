"use client";

import { ChevronDown, ListFilter, Plus } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ButtonPrimary } from "./ButtonPrimary";
import { JournalEntrySearch } from "./JournalEntrySearch";
import {
  categories,
  formatCategoryLabel,
  type Category,
  type JournalType,
} from "./shared";

type JournalEntryFiltersProps = {
  query?: string;
  selectedCategories?: Category[];
  selectedTypes?: JournalType[];
  onQueryChange?: (query: string) => void;
  onCategoriesChange?: (categories: Category[]) => void;
  onTypesChange?: (types: JournalType[]) => void;
  onAddEntry?: () => void;
  showAddEntry?: boolean;
};

const typeOptions: Array<{
  value: JournalType;
  label: string;
}> = [
  { value: "success", label: "Success" },
  { value: "attempt", label: "Attempt" },
];

export function JournalEntryFilters({
  query,
  selectedCategories,
  selectedTypes,
  onQueryChange,
  onCategoriesChange,
  onTypesChange,
  onAddEntry,
  showAddEntry = true,
}: JournalEntryFiltersProps = {}) {
  const [internalQuery, setInternalQuery] = useState("");
  const [internalCategories, setInternalCategories] = useState<Category[]>([]);
  const [internalTypes, setInternalTypes] = useState<JournalType[]>([]);
  const [areFiltersOpen, setAreFiltersOpen] = useState(
    Boolean(query || selectedCategories?.length || selectedTypes?.length),
  );
  const currentQuery = query ?? internalQuery;
  const currentCategories = selectedCategories ?? internalCategories;
  const currentTypes = selectedTypes ?? internalTypes;
  const activeFilterCount =
    Number(Boolean(currentQuery.trim())) +
    currentCategories.length +
    currentTypes.length;

  function changeQuery(nextQuery: string) {
    if (query === undefined) setInternalQuery(nextQuery);
    onQueryChange?.(nextQuery);
  }

  function changeCategories(nextCategories: Category[]) {
    if (selectedCategories === undefined) {
      setInternalCategories(nextCategories);
    }
    onCategoriesChange?.(nextCategories);
  }

  function changeTypes(nextTypes: JournalType[]) {
    if (selectedTypes === undefined) {
      setInternalTypes(nextTypes);
    }
    onTypesChange?.(nextTypes);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        aria-expanded={areFiltersOpen}
        aria-label={`Toggle journal filters${activeFilterCount ? `, ${activeFilterCount} active` : ""}`}
        className="relative size-8 rounded-md"
        onClick={() => setAreFiltersOpen((isOpen) => !isOpen)}
        size="icon-lg"
        type="button"
        variant="ghost"
      >
        <ListFilter className="size-4" />
        {activeFilterCount ? (
          <span className="absolute -right-1 -top-1 inline-flex size-5 items-center justify-center rounded-full bg-zinc-950 text-[11px] text-white">
            {activeFilterCount}
          </span>
        ) : null}
      </Button>
      {areFiltersOpen ? (
        <div className="order-3 flex w-full flex-col gap-2 md:order-none md:min-w-0 md:flex-1 md:flex-row">
          <div className="min-w-40 flex-1 md:max-w-md">
            <JournalEntrySearch
              value={currentQuery}
              onValueChange={changeQuery}
            />
          </div>
          <div className="grid grid-cols-2 gap-2 md:flex md:w-auto">
            <CheckboxFilterPill
              label="Category"
              options={categories.map((category) => ({
                value: category,
                label: formatCategoryLabel(category),
              }))}
              selected={currentCategories}
              onSelectedChange={changeCategories}
              triggerClassName="w-full md:w-auto"
            />
            <CheckboxFilterPill
              label="Type"
              options={typeOptions}
              selected={currentTypes}
              onSelectedChange={changeTypes}
              triggerClassName="w-full md:w-auto"
            />
          </div>
        </div>
      ) : null}
      {showAddEntry ? (
        <div className="ml-auto">
          <ButtonPrimary onClick={onAddEntry} type="button">
            <Plus className="size-4" />
            Add entry
          </ButtonPrimary>
        </div>
      ) : null}
    </div>
  );
}

function CheckboxFilterPill<T extends string>({
  label,
  options,
  selected,
  onSelectedChange,
  triggerClassName,
}: {
  label: string;
  options: Array<{ value: T; label: string }>;
  selected: T[];
  onSelectedChange: (selected: T[]) => void;
  triggerClassName?: string;
}) {
  const labelId = useId();

  function toggleOption(value: T, isChecked: boolean) {
    onSelectedChange(
      isChecked
        ? [...selected, value]
        : selected.filter((item) => item !== value),
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          aria-label={`${label} filter${selected.length ? `, ${selected.length} selected` : ""}`}
          className={`h-10 rounded-full px-3 font-medium ${triggerClassName ?? ""}`}
          type="button"
          variant="outline"
        >
          {label}
          {selected.length ? (
            <span className="inline-flex size-5 items-center justify-center rounded-full bg-zinc-950 text-[11px] text-white">
              {selected.length}
            </span>
          ) : null}
          <ChevronDown className="size-3.5 text-zinc-500" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 gap-1 p-2" align="start">
        <div className="flex items-center justify-between px-2 py-1">
          <span id={labelId} className="text-xs font-semibold text-zinc-600">
            {label}
          </span>
          {selected.length ? (
            <button
              className="text-xs font-medium text-zinc-500 hover:text-zinc-950"
              onClick={() => onSelectedChange([])}
              type="button"
            >
              Clear
            </button>
          ) : null}
        </div>
        <div aria-labelledby={labelId} className="grid" role="group">
          {options.map((option) => {
            const isChecked = selected.includes(option.value);

            return (
              <label
                key={option.value}
                className="flex min-h-9 cursor-pointer items-center gap-3 rounded-md px-2 text-sm text-zinc-700 hover:bg-zinc-100"
              >
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={(checked) =>
                    toggleOption(option.value, checked === true)
                  }
                />
                {option.label}
              </label>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
