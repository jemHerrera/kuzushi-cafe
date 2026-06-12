"use client";

import { useEffect, useState } from "react";

import type {
  AggregateStatsDetail,
  ApiErrorDetail,
  Category,
  JournalType,
} from "@/lib/managers/types";
import { AggregateView } from "./AggregateView";
import {
  AggregateViewFilters,
  type AggregateTimeline,
  type AggregateTypeFilter,
} from "./AggregateViewFilters";
import { AlertBanner } from "./AlertBanner";
import { ButtonSecondary } from "./ButtonSecondary";

export const sampleAggregate: AggregateStatsDetail = {
  object: "aggregate_stats",
  accountId: "component-library-account",
  category: "submission",
  timeline: "month",
  startAt: new Date("2026-06-01T00:00:00Z").getTime(),
  endAt: new Date("2026-06-30T23:59:59Z").getTime(),
  journalTypes: ["attempt", "success"],
  attempts: 5,
  successes: 4,
  series: [
    { label: "Jun 2", attempts: 1, successes: 1, occurrences: 2 },
    { label: "Jun 5", attempts: 2, successes: 1, occurrences: 3 },
    { label: "Jun 9", attempts: 1, successes: 2, occurrences: 3 },
    { label: "Jun 12", attempts: 1, successes: 0, occurrences: 1 },
  ],
  stats: [
    { label: "Armbar from closed guard", count: 4, percentage: 44 },
    { label: "Triangle choke", count: 3, percentage: 33 },
    { label: "Rear naked choke", count: 2, percentage: 22 },
  ],
};

type AggregateOverviewProps = {
  accountId?: string;
  data?: AggregateStatsDetail;
  onAddEntry?: () => void;
  refreshToken?: number;
};

export function AggregateOverview({
  accountId,
  data,
  onAddEntry,
  refreshToken = 0,
}: AggregateOverviewProps) {
  const [category, setCategory] = useState<Category>("submission");
  const [timeline, setTimeline] = useState<AggregateTimeline>("month");
  const [typeFilter, setTypeFilter] = useState<AggregateTypeFilter>("all");
  const [aggregate, setAggregate] = useState<AggregateStatsDetail | undefined>(
    data,
  );
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(data === undefined);
  const [retryToken, setRetryToken] = useState(0);
  const effectiveTypeFilter = category === "tap" ? "all" : typeFilter;
  const isStatic = data !== undefined;
  const displayedAggregate = isStatic ? data : aggregate;

  useEffect(() => {
    if (isStatic) return;

    const controller = new AbortController();
    const params = new URLSearchParams({ category, timeline });
    journalTypesForFilter(category, effectiveTypeFilter).forEach((value) =>
      params.append("journalTypes", value),
    );
    const endpoint = accountId
      ? `/api/accounts/${accountId}/aggregates`
      : "/api/aggregates";

    async function loadAggregate() {
      setIsLoading(true);
      setError(undefined);

      try {
        const response = await fetch(`${endpoint}?${params}`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          const detail = (await response.json()) as ApiErrorDetail;
          throw new Error(detail.error.message);
        }

        setAggregate((await response.json()) as AggregateStatsDetail);
      } catch (loadError) {
        if (controller.signal.aborted) return;
        setAggregate(undefined);
        setError(
          loadError instanceof Error
            ? loadError.message
            : "We could not load aggregate statistics.",
        );
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    loadAggregate();
    return () => controller.abort();
  }, [
    accountId,
    category,
    data,
    effectiveTypeFilter,
    isStatic,
    refreshToken,
    retryToken,
    timeline,
  ]);

  function changeCategory(nextCategory: Category) {
    setCategory(nextCategory);
    if (nextCategory === "tap") setTypeFilter("all");
  }

  return (
    <section className="grid gap-3" aria-label="Training aggregates">
      <h2 className="mt-1 text-2xl font-black tracking-tight mb-2">
        Training Activity
      </h2>
      <AggregateViewFilters
        category={category}
        timeline={timeline}
        typeFilter={effectiveTypeFilter}
        onCategoryChange={changeCategory}
        onTimelineChange={setTimeline}
        onTypeFilterChange={setTypeFilter}
      />
      {error ? (
        <div className="grid gap-2">
          <AlertBanner
            className="border-red-200 bg-red-50 text-red-900"
            message={error}
          />
          <ButtonSecondary
            className="w-fit"
            onClick={() => setRetryToken((token) => token + 1)}
            type="button"
          >
            Retry
          </ButtonSecondary>
        </div>
      ) : null}
      {isLoading ? (
        <AggregateLoadingState />
      ) : displayedAggregate ? (
        <AggregateView
          category={category}
          data={displayedAggregate}
          onAddEntry={accountId ? undefined : onAddEntry}
          typeFilter={effectiveTypeFilter}
          timeline={timeline}
        />
      ) : null}
    </section>
  );
}

function journalTypesForFilter(
  category: Category,
  typeFilter: AggregateTypeFilter,
): JournalType[] {
  if (category === "tap") return [];
  if (typeFilter === "attempt") return ["attempt"];
  if (typeFilter === "success") return ["success"];
  return ["attempt", "success"];
}

function AggregateLoadingState() {
  return (
    <div
      aria-label="Loading aggregate statistics"
      className="grid gap-4 rounded-lg border border-zinc-200 bg-white p-4"
    >
      <div className="grid gap-2">
        <div className="h-6 w-32 animate-pulse rounded bg-zinc-100" />
        <div className="h-4 w-64 max-w-full animate-pulse rounded bg-zinc-100" />
      </div>
      <div className="h-72 animate-pulse rounded-lg bg-zinc-100" />
      <div className="grid gap-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="grid gap-2">
            <div className="h-4 animate-pulse rounded bg-zinc-100" />
            <div className="h-2 animate-pulse rounded bg-zinc-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
