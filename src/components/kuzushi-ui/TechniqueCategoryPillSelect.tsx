"use client";

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
  onValueChange?: (category: Category) => void;
  variant?: "default" | "property";
};

export function TechniqueCategoryPillSelect({
  value,
  onValueChange,
  variant = "default",
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
      value={selectedCategory}
      onValueChange={(nextValue) => selectCategory(nextValue as Category)}
    >
      <SelectTrigger
        aria-label="Technique category"
        className={cx(
          "h-auto rounded-full border px-2.5 py-1 text-xs font-semibold capitalize shadow-none",
          categoryStyles[selectedCategory],
          variant === "property" && "",
        )}
      >
        <SelectValue>{selectedCategory}</SelectValue>
      </SelectTrigger>
      <SelectContent
        className="min-w-44 bg-white/75 p-1 shadow-lg backdrop-blur-md"
        align="start"
        position="popper"
      >
        {categories.map((category) => (
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
