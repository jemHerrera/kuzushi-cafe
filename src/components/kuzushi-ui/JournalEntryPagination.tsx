"use client";

import { useState, type MouseEvent } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type JournalEntryPaginationProps = {
  page?: number;
  pageCount?: number;
  onPageChange?: (page: number) => void;
};

export function JournalEntryPagination({
  page,
  pageCount = 4,
  onPageChange,
}: JournalEntryPaginationProps = {}) {
  const [internalPage, setInternalPage] = useState(1);
  const currentPage = Math.min(Math.max(page ?? internalPage, 1), pageCount);
  const visiblePages = getVisiblePages(currentPage, pageCount);

  function changePage(event: MouseEvent<HTMLAnchorElement>, nextPage: number) {
    event.preventDefault();
    if (nextPage < 1 || nextPage > pageCount || nextPage === currentPage) {
      return;
    }

    if (page === undefined) setInternalPage(nextPage);
    onPageChange?.(nextPage);
  }

  return (
    <div className="border-t border-zinc-200 bg-white px-3 py-2">
      <Pagination className="items-center justify-between">
        <span className="text-sm text-zinc-600">
          Page {currentPage} of {pageCount}
        </span>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              aria-disabled={currentPage === 1}
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : undefined
              }
              href="#"
              onClick={(event) => changePage(event, currentPage - 1)}
            />
          </PaginationItem>
          {visiblePages.map((item, index) =>
            item === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={item}>
                <PaginationLink
                  href="#"
                  isActive={item === currentPage}
                  onClick={(event) => changePage(event, item)}
                >
                  {item}
                </PaginationLink>
              </PaginationItem>
            ),
          )}
          <PaginationItem>
            <PaginationNext
              aria-disabled={currentPage === pageCount}
              className={
                currentPage === pageCount
                  ? "pointer-events-none opacity-50"
                  : undefined
              }
              href="#"
              onClick={(event) => changePage(event, currentPage + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

function getVisiblePages(page: number, pageCount: number) {
  if (pageCount <= 5) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const pages: Array<number | "ellipsis"> = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(pageCount - 1, page + 1);

  if (start > 2) pages.push("ellipsis");
  for (let item = start; item <= end; item += 1) pages.push(item);
  if (end < pageCount - 1) pages.push("ellipsis");
  pages.push(pageCount);

  return pages;
}
