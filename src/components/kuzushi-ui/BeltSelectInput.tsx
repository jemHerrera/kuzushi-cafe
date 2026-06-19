"use client";

import { ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BeltMarker, belts, cx, formatBelt, type Belt } from "./shared";

type BeltSelectInputProps = {
  "aria-label"?: string;
  disabled?: boolean;
  onValueChange: (belt: Belt) => void;
  value: Belt;
  variant?: "default" | "property";
};

export function BeltSelectInput({
  "aria-label": ariaLabel = "Belt",
  disabled = false,
  onValueChange,
  value,
  variant = "default",
}: BeltSelectInputProps) {
  return (
    <Select
      disabled={disabled}
      value={value}
      onValueChange={(nextValue) => onValueChange(nextValue as Belt)}
    >
      <SelectTrigger
        aria-label={ariaLabel}
        className={cx(
          "h-11 rounded-md bg-white px-3 text-sm text-zinc-900 shadow-none",
          variant === "property" &&
            "h-10 border-transparent bg-transparent px-2 hover:bg-zinc-100 focus-visible:border-transparent focus-visible:bg-zinc-100 focus-visible:ring-2",
        )}
      >
        <SelectValue>
          <BeltOptionContent belt={value} />
        </SelectValue>
        <ChevronDown className="size-4 shrink-0 text-zinc-500" />
      </SelectTrigger>
      <SelectContent
        className="min-w-[var(--radix-select-trigger-width)] bg-white/95 p-1 shadow-lg backdrop-blur-md"
        align="start"
        position="popper"
      >
        {belts.map((belt) => (
          <SelectItem
            key={belt}
            value={belt}
            textValue={formatBelt(belt)}
            showIndicator={false}
            className="cursor-pointer py-2 pr-2 pl-2"
          >
            <BeltOptionContent belt={belt} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function BeltOptionContent({ belt }: { belt: Belt }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-2">
      <BeltMarker belt={belt} />
      <span className="truncate">{formatBelt(belt)}</span>
    </span>
  );
}
