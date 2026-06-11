"use client";

import { useState, type MouseEvent } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type JournalEntryPaginationProps = {
  page?: number;
  hasNext?: boolean;
  onPageChange?: (page: number) => void;
};

export function JournalEntryPagination({
  page,
  hasNext = true,
  onPageChange,
}: JournalEntryPaginationProps = {}) {
  const [internalPage, setInternalPage] = useState(1);
  const currentPage = Math.max(page ?? internalPage, 1);
  const hasPrevious = currentPage > 1;

  function changePage(event: MouseEvent<HTMLAnchorElement>, nextPage: number) {
    event.preventDefault();
    if (nextPage < 1 || nextPage === currentPage) return;
    if (nextPage < currentPage && !hasPrevious) return;
    if (nextPage > currentPage && !hasNext) return;

    if (page === undefined) setInternalPage(nextPage);
    onPageChange?.(nextPage);
  }

  return (
    <div className="border-t border-zinc-200 bg-white px-3 py-2">
      <Pagination className="items-center justify-between">
        <span className="text-sm text-zinc-600">Page {currentPage}</span>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              aria-disabled={!hasPrevious}
              className={!hasPrevious ? "pointer-events-none opacity-50" : undefined}
              href="#"
              onClick={(event) => changePage(event, currentPage - 1)}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              aria-disabled={!hasNext}
              className={!hasNext ? "pointer-events-none opacity-50" : undefined}
              href="#"
              onClick={(event) => changePage(event, currentPage + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
