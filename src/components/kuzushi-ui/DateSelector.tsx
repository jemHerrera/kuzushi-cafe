"use client";

import { useRef } from "react";
import { Input } from "@/components/ui/input";

export function DateSelector() {
  const inputRef = useRef<HTMLInputElement>(null);

  function openDatePicker() {
    const input = inputRef.current;

    if (!input) {
      return;
    }

    try {
      input.showPicker();
    } catch {
      input.focus();
    }
  }

  return (
    <Input
      ref={inputRef}
      className="h-11 rounded-md bg-white px-3 text-sm text-zinc-900"
      defaultValue="2026-06-03"
      onClick={openDatePicker}
      type="date"
    />
  );
}
