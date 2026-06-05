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

export function TechniqueCategoryPillSelect() {
  const [selectedCategory, setSelectedCategory] =
    useState<Category>("submission");

  return (
    <Select
      value={selectedCategory}
      onValueChange={(value) => setSelectedCategory(value as Category)}
    >
      <SelectTrigger
        aria-label="Technique category"
        className={cx(
          "h-auto rounded-full border px-2.5 py-1 text-xs font-semibold capitalize shadow-none",
          categoryStyles[selectedCategory],
        )}
      >
        <SelectValue>{selectedCategory}</SelectValue>
      </SelectTrigger>
      <SelectContent
        className="min-w-44 p-1"
        align="start"
        position="popper"
      >
        {categories.map((category) => (
          <SelectItem
            key={category}
            value={category}
            textValue={category}
            className="py-1 pr-8 pl-1.5"
          >
            <TechniqueCategoryPill category={category} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
