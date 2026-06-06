"use client";

import {
  type ComponentProps,
  type KeyboardEventHandler,
  type ReactElement,
  type ReactNode,
  useRef,
} from "react";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Search } from "./Search";

type SearchSelectPopoverProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: ReactElement;
  listboxId: string;
  searchLabel?: string;
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: ComponentProps<"input">["onChange"];
  onSearchKeyDown: KeyboardEventHandler<HTMLInputElement>;
  children: ReactNode;
  className?: string;
  listboxClassName?: string;
};

export const searchSelectOptionClassName =
  "flex min-h-8 w-full cursor-pointer items-center gap-3 rounded-md px-4 text-left text-sm hover:bg-zinc-100";

export function SearchSelectPopover({
  open,
  onOpenChange,
  trigger,
  listboxId,
  searchLabel,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  onSearchKeyDown,
  children,
  className,
  listboxClassName,
}: SearchSelectPopoverProps) {
  const searchRef = useRef<HTMLInputElement>(null);

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverAnchor asChild>{trigger}</PopoverAnchor>
      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={0}
        collisionPadding={12}
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          searchRef.current?.focus({ preventScroll: true });
        }}
        className={cn(
          "w-(--radix-popover-trigger-width) max-w-[calc(100vw-1.5rem)] gap-0 overflow-hidden border border-zinc-200 bg-white p-0 shadow-lg ring-0",
          "data-[side=bottom]:[translate:0_calc(-1*var(--radix-popover-trigger-height))]",
          "data-[side=top]:[translate:0_var(--radix-popover-trigger-height)]",
          className,
        )}
      >
        <Search
          aria-controls={listboxId}
          aria-expanded={open}
          aria-label={searchLabel}
          autoComplete="off"
          className="h-10 rounded-none border-0 border-b border-zinc-200 bg-zinc-50/60 px-4 pl-10 shadow-none focus-visible:border-zinc-300 focus-visible:ring-0"
          placeholder={searchPlaceholder}
          role="combobox"
          ref={searchRef}
          value={searchValue}
          onChange={onSearchChange}
          onKeyDown={onSearchKeyDown}
        />
        <div
          id={listboxId}
          role="listbox"
          className={cn("grid max-h-72 overflow-y-auto p-1", listboxClassName)}
        >
          {children}
        </div>
      </PopoverContent>
    </Popover>
  );
}
