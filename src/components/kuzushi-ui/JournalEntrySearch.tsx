"use client";

import { useState } from "react";
import { Command, CommandInput } from "@/components/ui/command";

export function JournalEntrySearch({
  value,
  onValueChange,
}: {
  value?: string;
  onValueChange?: (value: string) => void;
} = {}) {
  const [internalValue, setInternalValue] = useState("");
  const currentValue = value ?? internalValue;

  function changeValue(nextValue: string) {
    if (value === undefined) {
      setInternalValue(nextValue);
    }

    onValueChange?.(nextValue);
  }

  return (
    <Command className="h-auto gap-0 p-0" shouldFilter={false}>
      <CommandInput
        aria-label="Search journal entries"
        placeholder="Search journal entries"
        value={currentValue}
        onValueChange={changeValue}
      />
    </Command>
  );
}
