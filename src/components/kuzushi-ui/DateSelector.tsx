"use client";

import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { formControlClass } from "./shared";

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
      className={formControlClass}
      defaultValue="2026-06-03"
      onClick={openDatePicker}
      type="date"
    />
  );
}
