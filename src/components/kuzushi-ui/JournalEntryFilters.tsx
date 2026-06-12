"use client";

import { ChevronDown, Plus } from "lucide-react";
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
  const currentQuery = query ?? internalQuery;
  const currentCategories = selectedCategories ?? internalCategories;
  const currentTypes = selectedTypes ?? internalTypes;

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
      <div className="order-3 min-w-40 flex-1 md:order-1">
        <JournalEntrySearch value={currentQuery} onValueChange={changeQuery} />
      </div>
      <div className="order-2">
        <CheckboxFilterPill
          label="Category"
          options={categories.map((category) => ({
            value: category,
            label: formatCategoryLabel(category),
          }))}
          selected={currentCategories}
          onSelectedChange={changeCategories}
        />
      </div>
      <div className="order-2 md:order-3">
        <CheckboxFilterPill
          label="Type"
          options={typeOptions}
          selected={currentTypes}
          onSelectedChange={changeTypes}
        />
      </div>
      {showAddEntry ? (
        <div className="order-1 flex w-full justify-end md:order-4 md:w-auto">
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
}: {
  label: string;
  options: Array<{ value: T; label: string }>;
  selected: T[];
  onSelectedChange: (selected: T[]) => void;
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
          className="h-10 rounded-full px-3 font-medium"
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
