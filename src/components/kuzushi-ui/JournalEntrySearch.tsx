"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "./Search";
import { cn } from "@/lib/utils";

export function JournalEntrySearch({
  value,
  onValueChange,
  className,
}: {
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
} = {}) {
  const [draftValue, setDraftValue] = useState(value ?? "");
  const [lastValue, setLastValue] = useState(value);
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  if (value !== lastValue) {
    setLastValue(value);
    if (value !== undefined) setDraftValue(value);
  }

  useEffect(
    () => () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    },
    [],
  );

  function changeValue(nextValue: string) {
    setDraftValue(nextValue);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      onValueChange?.(nextValue);
    }, 300);
  }

  return (
    <Search
      aria-label="Search entries"
      className={cn("h-10 rounded-full bg-transparent shadow-none", className)}
      placeholder="Search entries"
      value={draftValue}
      onChange={(event) => changeValue(event.target.value)}
    />
  );
}
