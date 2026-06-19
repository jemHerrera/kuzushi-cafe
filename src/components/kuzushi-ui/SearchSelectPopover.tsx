"use client";

import {
  type ComponentProps,
  type KeyboardEventHandler,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
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
  mobileTitle?: string;
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
  mobileTitle,
  children,
  className,
  listboxClassName,
}: SearchSelectPopoverProps) {
  const searchRef = useRef<HTMLInputElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const dragStartYRef = useRef<number | null>(null);
  const dragOffsetRef = useRef(0);
  const dragCloseTimerRef = useRef<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isDragClosing, setIsDragClosing] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const isMobileSheetMounted = !isDesktop && open;

  useEffect(() => {
    if (!open || isDesktop) return;
    if (isDragClosing) return;
    const frame = window.requestAnimationFrame(() => {
      mobileSearchRef.current?.focus({ preventScroll: true });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [isDesktop, isDragClosing, open]);

  function resetSheetDragState() {
    if (dragCloseTimerRef.current !== null) {
      window.clearTimeout(dragCloseTimerRef.current);
      dragCloseTimerRef.current = null;
    }
    dragStartYRef.current = null;
    dragOffsetRef.current = 0;
    setDragOffset(0);
    setIsDragging(false);
    setIsDragClosing(false);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      resetSheetDragState();
    } else {
      dragStartYRef.current = null;
      setIsDragging(false);
    }

    onOpenChange(nextOpen);
  }

  useEffect(() => {
    return () => {
      if (dragCloseTimerRef.current !== null) {
        window.clearTimeout(dragCloseTimerRef.current);
      }
    };
  }, []);

  function updateDragOffset(offset: number) {
    dragOffsetRef.current = offset;
    setDragOffset(offset);
  }

  function startSheetDrag(event: PointerEvent<HTMLDivElement>) {
    if (isDesktop || isDragClosing) return;
    dragStartYRef.current = event.clientY;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function dragSheet(event: PointerEvent<HTMLDivElement>) {
    if (dragStartYRef.current === null) return;
    updateDragOffset(Math.max(0, event.clientY - dragStartYRef.current));
  }

  function endSheetDrag() {
    dragStartYRef.current = null;
    setIsDragging(false);
    if (dragOffsetRef.current > 96) {
      setIsDragClosing(true);
      updateDragOffset(window.innerHeight);
      dragCloseTimerRef.current = window.setTimeout(() => {
        dragCloseTimerRef.current = null;
        setIsDragClosing(false);
        handleOpenChange(false);
      }, 180);
      return;
    }

    updateDragOffset(0);
  }

  return (
    <>
      <Popover open={isDesktop && open} onOpenChange={handleOpenChange} modal>
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
            className={cn(
              "grid min-h-0 max-h-72 touch-pan-y overflow-y-auto overscroll-contain p-1",
              listboxClassName,
            )}
          >
            {children}
          </div>
        </PopoverContent>
      </Popover>

      {!isDesktop && isMobileSheetMounted ? (
        <Sheet open={open} onOpenChange={handleOpenChange}>
          <SheetContent
            className={cn(
              "h-[95dvh] gap-0 rounded-t-2xl border-x-0 border-b-0 bg-zinc-50 p-0 shadow-2xl data-[side=bottom]:h-[95dvh] sm:hidden",
              isDragging && "transition-none",
              isDragClosing && "duration-200 ease-out",
            )}
            side="bottom"
            showCloseButton={false}
            style={
              dragOffset > 0 ? { transform: `translateY(${dragOffset}px)` } : {}
            }
          >
            <div
              className="flex touch-none justify-center px-4 pb-2 pt-2"
              onPointerDown={startSheetDrag}
              onPointerMove={dragSheet}
              onPointerUp={endSheetDrag}
              onPointerCancel={endSheetDrag}
            >
              <div className="h-1.5 w-14 rounded-full bg-zinc-300" />
            </div>
            <div className="sticky top-0 z-10 grid gap-4 bg-zinc-50 px-4 pb-3 pt-2">
              <SheetTitle className="text-center text-lg font-bold text-zinc-900">
                {mobileTitle ?? searchLabel ?? "Select option"}
              </SheetTitle>
              <SheetDescription className="sr-only">
                Search and choose an option.
              </SheetDescription>
              <Search
                aria-controls={listboxId}
                aria-expanded={open}
                aria-label={searchLabel}
                autoComplete="off"
                className="h-12 rounded-xl border-0 bg-white px-4 pl-10 text-base shadow-none focus-visible:ring-2"
                placeholder={searchPlaceholder}
                role="combobox"
                ref={mobileSearchRef}
                value={searchValue}
                onChange={onSearchChange}
                onKeyDown={onSearchKeyDown}
              />
            </div>
            <div
              id={listboxId}
              role="listbox"
              className={cn(
                "grid min-h-0 flex-1 touch-pan-y content-start overflow-y-auto overscroll-contain px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]",
                listboxClassName,
              )}
            >
              <div className="grid content-start gap-1 rounded-xl bg-white p-1">
                {children}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      ) : null}
    </>
  );
}

function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === "undefined") {
        return () => {};
      }

      const media = window.matchMedia(query);
      media.addEventListener("change", onStoreChange);
      return () => media.removeEventListener("change", onStoreChange);
    },
    () => {
      if (typeof window === "undefined") {
        return false;
      }

      return window.matchMedia(query).matches;
    },
    () => false,
  );
}
