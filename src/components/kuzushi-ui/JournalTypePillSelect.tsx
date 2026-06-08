"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { JournalType } from "./shared";

const journalTypes: JournalType[] = ["attempt", "success"];

export function JournalTypePillSelect({
  value,
  onValueChange,
}: {
  value?: JournalType;
  onValueChange?: (value: JournalType) => void;
}) {
  const [internalValue, setInternalValue] =
    useState<JournalType>(value ?? "attempt");
  const selectedValue = value ?? internalValue;

  function changeValue(nextValue: JournalType) {
    setInternalValue(nextValue);
    onValueChange?.(nextValue);
  }

  return (
    <Select
      value={selectedValue}
      onValueChange={(nextValue) => changeValue(nextValue as JournalType)}
    >
      <SelectTrigger
        aria-label="Journal type"
        className="h-auto w-fit rounded-full border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs font-semibold capitalize text-zinc-700 shadow-none"
      >
        <SelectValue>{selectedValue}</SelectValue>
      </SelectTrigger>
      <SelectContent
        align="start"
        className="min-w-32 p-1 text-sm"
        position="popper"
      >
        {journalTypes.map((journalType) => (
          <SelectItem
            key={journalType}
            value={journalType}
            showIndicator={false}
            className={cn("cursor-pointer text-sm capitalize")}
          >
            {journalType}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
