"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cx } from "./shared";

type DateSelectorProps = {
  value?: Date;
  defaultValue?: Date;
  defaultToToday?: boolean;
  placeholder?: string;
  ariaLabel?: string;
  onValueChange?: (date: Date | undefined) => void;
  variant?: "default" | "property";
};

export function DateSelector({
  value,
  defaultValue,
  defaultToToday = false,
  placeholder = "Pick a date",
  ariaLabel,
  onValueChange,
  variant = "default",
}: DateSelectorProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalDate, setInternalDate] = useState<Date | undefined>(
    () => defaultValue ?? (defaultToToday ? new Date() : undefined),
  );
  const selectedDate = value ?? internalDate;

  function selectDate(date: Date | undefined) {
    setInternalDate(date);
    onValueChange?.(date);

    if (date) {
      setIsOpen(false);
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          aria-label={
            ariaLabel
              ? `${ariaLabel}: ${selectedDate ? format(selectedDate, "PPP") : placeholder}`
              : undefined
          }
          type="button"
          variant="outline"
          className={cx(
            "h-11 w-full justify-start rounded-md px-3 text-left text-sm font-normal",
            !selectedDate && "text-muted-foreground",
            variant === "property" &&
              "h-10 border-transparent bg-transparent px-2 shadow-none hover:bg-zinc-100 focus-visible:ring-2",
          )}
        >
          {variant === "default" ? (
            <CalendarIcon data-icon="inline-start" />
          ) : null}
          {selectedDate ? format(selectedDate, "PPP") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          defaultMonth={selectedDate}
          captionLayout="dropdown"
          startMonth={new Date(1900, 0)}
          endMonth={new Date(new Date().getFullYear() + 1, 11)}
          onSelect={selectDate}
        />
      </PopoverContent>
    </Popover>
  );
}
