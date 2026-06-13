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
import { TechniqueCategoryPill } from "./TechniqueCategoryPill";
import { categories, categoryStyles, cx, type Category } from "./shared";

type TechniqueCategoryPillSelectProps = {
  value?: Category;
  options?: Category[];
  onValueChange?: (category: Category) => void;
  variant?: "default" | "property" | "table" | "small";
  disabled?: boolean;
};

export function TechniqueCategoryPillSelect({
  value,
  options = categories,
  onValueChange,
  variant = "default",
  disabled = false,
}: TechniqueCategoryPillSelectProps = {}) {
  const [internalCategory, setInternalCategory] =
    useState<Category>("submission");
  const selectedCategory = value ?? internalCategory;

  function selectCategory(category: Category) {
    setInternalCategory(category);
    onValueChange?.(category);
  }

  return (
    <Select
      disabled={disabled}
      value={selectedCategory}
      onValueChange={(nextValue) => selectCategory(nextValue as Category)}
    >
      <SelectTrigger
        aria-label="Technique category"
        className={cx(
          "h-auto w-fit rounded-full border px-2.5 py-1 text-xs font-semibold capitalize shadow-none",
          categoryStyles[selectedCategory],
          variant === "property" && "",
          variant === "table" && "px-2 py-0.5",
          variant === "small" && "px-2 max-h-7 py-0 text-[11px]",
        )}
      >
        <SelectValue>{selectedCategory}</SelectValue>
        <ChevronDown
          className={cx(
            "size-3.5 shrink-0 text-current",
            variant === "small" && "size-3",
          )}
        />
      </SelectTrigger>
      <SelectContent
        className="min-w-44 bg-white/75 p-1 shadow-lg backdrop-blur-md"
        align="start"
        position="popper"
      >
        {options.map((category) => (
          <SelectItem
            key={category}
            value={category}
            textValue={category}
            showIndicator={false}
            className={cx("py-1 pr-1.5 pl-1.5 cursor-pointer")}
          >
            <TechniqueCategoryPill category={category} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
