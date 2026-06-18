"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  parseJournalQuery,
  serializeJournalQuery,
  updateJournalQuery,
  type JournalQuery,
} from "@/lib/api/journal-query";
import type {
  ApiErrorDetail,
  JournalEntryDetail,
  PaginatedResponse,
} from "@/lib/managers/types";
import { ErrorState } from "./ErrorState";
import { JournalEntryCreate } from "./JournalEntryCreate";
import { JournalEntryFilters } from "./JournalEntryFilters";
import { JournalEntryHeading } from "./JournalEntryHeading";
import { JournalEntryPagination } from "./JournalEntryPagination";
import { JournalEntryRow } from "./JournalEntryRow";
import {
  initialsForPartner,
  sampleEntries,
  type JournalEntry,
  type Partner,
  type TrainingPartnerDetail,
} from "./shared";

export function JournalEntryTable({
  accountId,
  entries,
  initialEntries = [],
  initialQueryKey,
  onEntriesChange,
  readOnly = false,
  refreshToken = 0,
}: {
  accountId?: string;
  entries?: JournalEntry[];
  initialEntries?: JournalEntryDetail[];
  initialQueryKey?: string;
  onEntriesChange?: () => void;
  readOnly?: boolean;
  refreshToken?: number;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [apiEntries, setApiEntries] = useState<JournalEntry[]>(() =>
    initialEntries.map(toJournalEntry),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const hasUsedInitialEntries = useRef(false);
  const isStatic = entries !== undefined || (readOnly && !accountId);
  const query = useMemo(() => {
    const parsed = parseJournalQuery(
      `http://kuzushi.local${pathname}?${searchParams.toString()}`,
    );
    return {
      ...parsed,
      filter: { ...parsed.filter, isNoGi: undefined },
    };
  }, [pathname, searchParams]);

  useEffect(() => {
    if (isStatic) return;

    const controller = new AbortController();
    const requestQuery: JournalQuery = {
      ...query,
      limit: query.limit + 1,
    };
    const params = serializeJournalQuery(requestQuery);
    const queryKey = serializeJournalQuery(query).toString();
    if (
      !hasUsedInitialEntries.current &&
      initialQueryKey === queryKey &&
      refreshKey === 0 &&
      refreshToken === 0
    ) {
      hasUsedInitialEntries.current = true;
      return;
    }
    hasUsedInitialEntries.current = true;

    async function loadEntries() {
      setIsLoading(true);
      setError(undefined);
      try {
        const endpoint = accountId
          ? `/api/accounts/${accountId}/journal-entries`
          : "/api/journal-entries";
        const response = await fetch(`${endpoint}?${params}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          const detail = (await response.json()) as ApiErrorDetail;
          throw new Error(detail.error.message);
        }

        const data =
          (await response.json()) as PaginatedResponse<JournalEntryDetail>;
        setApiEntries(data.items.map(toJournalEntry));
      } catch (loadError) {
        if (controller.signal.aborted) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "We could not load journal entries.",
        );
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    loadEntries();
    return () => controller.abort();
  }, [accountId, initialQueryKey, isStatic, query, refreshKey, refreshToken]);

  const tableEntries = isStatic ? (entries ?? sampleEntries) : apiEntries;
  const visibleEntries = isStatic
    ? filterStaticEntries(tableEntries, query)
    : tableEntries.slice(0, query.limit);
  const hasNext = isStatic ? false : tableEntries.length > query.limit;
  const page = Math.floor(query.offset / query.limit) + 1;

  function replaceQuery(nextQuery: JournalQuery) {
    const params = serializeJournalQuery(nextQuery);
    window.history.replaceState(
      null,
      "",
      `${pathname}${params.size ? `?${params}` : ""}`,
    );
  }

  function refreshEntries() {
    setRefreshKey((key) => key + 1);
    onEntriesChange?.();
  }

  return (
    <section className="grid gap-3">
      <JournalEntryFilters
        query={query.filter.search ?? ""}
        selectedCategories={query.filter.category ?? []}
        selectedTypes={query.filter.journalTypes ?? []}
        onQueryChange={(search) =>
          replaceQuery(
            updateJournalQuery(query, {
              filter: { search: search.trim() || undefined },
            }),
          )
        }
        onCategoriesChange={(category) =>
          replaceQuery(
            updateJournalQuery(query, {
              filter: { category: category.length ? category : undefined },
            }),
          )
        }
        onTypesChange={(journalTypes) =>
          replaceQuery(
            updateJournalQuery(query, {
              filter: {
                journalTypes: journalTypes.length ? journalTypes : undefined,
              },
            }),
          )
        }
        onAddEntry={() => setIsCreateOpen(true)}
        showAddEntry={!readOnly}
      />
      {error ? (
        <ErrorState
          message={error}
          onRetry={() => setRefreshKey((key) => key + 1)}
        />
      ) : null}
      <div className="overflow-x-auto">
        <table
          className={`w-full border-collapse md:table-fixed ${
            readOnly ? "md:min-w-[736px]" : "md:min-w-[776px]"
          }`}
        >
          <colgroup className="max-md:hidden">
            <col className="w-[124px]" />
            <col className="w-[220px]" />
            <col className="w-[88px]" />
            <col className="w-[160px]" />
            <col className="w-[144px]" />
            {!readOnly ? <col className="w-10" /> : null}
          </colgroup>
          <JournalEntryHeading
            readOnly={readOnly}
            sort={query.sort}
            onSortChange={(sort) =>
              replaceQuery(updateJournalQuery(query, { sort }))
            }
          />
          <tbody>
            {visibleEntries.map((entry) => (
              <JournalEntryRow
                key={entry.id}
                entry={entry}
                readOnly={readOnly}
                onSaved={refreshEntries}
                onDeleted={refreshEntries}
              />
            ))}
            {!isLoading && visibleEntries.length === 0 ? (
              <tr>
                <td
                  className="px-3 py-10 text-center text-sm text-zinc-500"
                  colSpan={readOnly ? 5 : 6}
                >
                  No entries yet
                </td>
              </tr>
            ) : null}
            {isLoading && visibleEntries.length === 0 ? (
              <JournalTableSkeleton readOnly={readOnly} />
            ) : null}
          </tbody>
        </table>
        {!isLoading ? (
          <JournalEntryPagination
            page={page}
            hasNext={hasNext}
            onPageChange={(nextPage) =>
              replaceQuery(
                updateJournalQuery(query, {
                  offset: (nextPage - 1) * query.limit,
                }),
              )
            }
          />
        ) : null}
      </div>
      {!readOnly ? (
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent
            className="max-h-[calc(100vh-2rem)] max-w-2xl overflow-y-auto bg-transparent p-0 ring-0 sm:max-w-2xl"
            showCloseButton={false}
          >
            <DialogDescription className="sr-only">
              Add a journal entry with technique, partner, and training details.
            </DialogDescription>
            <JournalEntryCreate
              onClose={() => setIsCreateOpen(false)}
              onSaved={refreshEntries}
              withinDialog
            />
          </DialogContent>
        </Dialog>
      ) : null}
    </section>
  );
}

function JournalTableSkeleton({ readOnly }: { readOnly: boolean }) {
  return Array.from({ length: 4 }, (_, row) => (
    <tr
      key={row}
      aria-label={row === 0 ? "Loading journal entries" : undefined}
    >
      {Array.from({ length: readOnly ? 5 : 6 }, (_, column) => (
        <td
          key={column}
          className="border-t border-zinc-100 px-3 py-3 first:border-t-0"
        >
          <Skeleton className="h-5 w-full" />
        </td>
      ))}
    </tr>
  ));
}

function toJournalEntry(entry: JournalEntryDetail): JournalEntry {
  return {
    id: entry.id,
    category: entry.category,
    technique: entry.name,
    setup: entry.setup,
    journalType: entry.journalType,
    notes: entry.notes,
    intensity: entry.intensity,
    isNoGi: entry.isNoGi,
    partner: entry.trainingPartner
      ? toPartner({
          id: entry.trainingPartner.id,
          object: entry.trainingPartner.accountId
            ? "training_partner"
            : "custom_training_partner",
          accountId: entry.trainingPartner.accountId ?? "",
          firstName: entry.trainingPartner.firstName,
          lastName: entry.trainingPartner.lastName,
          profilePhoto: entry.trainingPartner.profilePhoto,
          belt: entry.trainingPartner.belt ?? "unknown",
          weight: entry.trainingPartner.weight ?? "unknown",
          age: entry.trainingPartner.age,
          createdAt: 0,
          updatedAt: 0,
        } as TrainingPartnerDetail)
      : undefined,
    trainedDate:
      entry.trainedAt !== undefined
        ? new Date(entry.trainedAt).toISOString().slice(0, 10)
        : undefined,
  };
}

function toPartner(partner: TrainingPartnerDetail): Partner {
  return {
    id: partner.id,
    accountId:
      partner.object === "training_partner" ? partner.accountId : undefined,
    firstName: partner.firstName,
    lastName: partner.lastName,
    initials: initialsForPartner(partner),
    profilePhoto:
      partner.object === "training_partner" ? partner.profilePhoto : undefined,
    belt: partner.belt,
    weight: partner.weight,
    age: partner.object === "custom_training_partner" ? partner.age : undefined,
  };
}

function filterStaticEntries(entries: JournalEntry[], query: JournalQuery) {
  return entries
    .filter(
      (entry) =>
        matchesSearch(entry, query.filter.search ?? "") &&
        matchesCategory(entry, query.filter.category ?? []) &&
        matchesJournalType(entry, query.filter.journalTypes ?? []),
    )
    .sort((left, right) => compareEntries(left, right, query))
    .slice(query.offset, query.offset + query.limit);
}

function matchesSearch(entry: JournalEntry, search: string) {
  const normalizedSearch = normalize(search);
  if (!normalizedSearch) return true;

  const partnerName = entry.partner
    ? [entry.partner.firstName, entry.partner.lastName]
        .filter(Boolean)
        .join(" ")
    : "";

  return [
    entry.technique,
    entry.setup ?? "",
    entry.category,
    entry.journalType ?? "",
    partnerName,
    entry.trainedDate ?? "",
  ].some((value) => normalize(value).includes(normalizedSearch));
}

function matchesCategory(
  entry: JournalEntry,
  categories: JournalEntry["category"][],
) {
  return categories.length === 0 || categories.includes(entry.category);
}

function matchesJournalType(
  entry: JournalEntry,
  journalTypes: NonNullable<JournalQuery["filter"]["journalTypes"]>,
) {
  if (journalTypes.length === 0) return true;
  if (!entry.journalType) return false;
  return journalTypes.includes(entry.journalType);
}

function compareEntries(
  left: JournalEntry,
  right: JournalEntry,
  query: JournalQuery,
) {
  const direction = query.sort.direction === "asc" ? 1 : -1;
  const field = query.sort.field;
  const leftValue = sortValue(left, field);
  const rightValue = sortValue(right, field);
  return leftValue.localeCompare(rightValue) * direction;
}

function sortValue(entry: JournalEntry, field: JournalQuery["sort"]["field"]) {
  if (field === "trainedAt") return entry.trainedDate ?? "";
  if (field === "category") return entry.category;
  if (field === "name") return entry.technique;
  if (field === "journalType") return entry.journalType ?? "";
  return entry.partner
    ? [entry.partner.firstName, entry.partner.lastName]
        .filter(Boolean)
        .join(" ")
    : "";
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}
