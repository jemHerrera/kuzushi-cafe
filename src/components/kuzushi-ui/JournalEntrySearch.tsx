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
  const [internalValue, setInternalValue] = useState("");
  const [draftValue, setDraftValue] = useState(value ?? internalValue);
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (value !== undefined) setDraftValue(value);
  }, [value]);

  useEffect(
    () => () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    },
    [],
  );

  function changeValue(nextValue: string) {
    setDraftValue(nextValue);
    if (value === undefined) {
      setInternalValue(nextValue);
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      onValueChange?.(nextValue);
    }, 300);
  }

  return (
    <Search
      aria-label="Search journal entries"
      className={cn("h-10 rounded-full bg-transparent shadow-none", className)}
      placeholder="Search journal entries"
      value={draftValue}
      onChange={(event) => changeValue(event.target.value)}
    />
  );
}
