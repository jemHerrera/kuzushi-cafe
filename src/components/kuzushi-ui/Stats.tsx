"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type {
  ApiErrorDetail,
  Category,
  StatsDetail,
  StatsTimeline,
  StatsTypeFilter,
} from "@/lib/managers/types";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import { TechniqueCategoryPillSelect } from "./TechniqueCategoryPillSelect";

const timelineOptions: Array<{ value: StatsTimeline; label: string }> = [
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
  { value: "year", label: "This year" },
  { value: "all", label: "All time" },
];

const typeOptions: Array<{ value: StatsTypeFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "success", label: "Successes only" },
];

const categoryChartColors: Record<Category, string> = {
  submission: "#be123c",
  takedown: "#c2410c",
  sweep: "#b45309",
  "guard-pass": "#047857",
  reversal: "#0369a1",
  "back-take": "#6d28d9",
  "leg-entry": "#a21caf",
  escape: "#0e7490",
  tap: "#3f3f46",
  "off-balance": "#4d7c0f",
  position: "#4338ca",
  "guard-retention": "#0f766e",
  other: "#57534e",
};

export function Stats({
  accountId,
  onAddEntry,
  refreshToken = 0,
}: {
  accountId?: string;
  onAddEntry?: () => void;
  refreshToken?: number;
}) {
  const [category, setCategory] = useState<Category>("submission");
  const [timeline, setTimeline] = useState<StatsTimeline>("month");
  const [typeFilter, setTypeFilter] = useState<StatsTypeFilter>("all");
  const [stats, setStats] = useState<StatsDetail>();
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [retryToken, setRetryToken] = useState(0);
  const effectiveType = category === "tap" ? "all" : typeFilter;

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({
      category,
      timeline,
      type: effectiveType,
    });

    async function loadStats() {
      setIsLoading(true);
      setError(undefined);

      try {
        const endpoint = accountId
          ? `/api/accounts/${accountId}/stats`
          : "/api/stats";
        const response = await fetch(`${endpoint}?${params}`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          const detail = (await response.json()) as ApiErrorDetail;
          throw new Error(detail.error.message);
        }
        setStats((await response.json()) as StatsDetail);
      } catch (loadError) {
        if (controller.signal.aborted) return;
        setStats(undefined);
        setError(
          loadError instanceof Error
            ? loadError.message
            : "We could not load stats.",
        );
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    void loadStats();
    return () => controller.abort();
  }, [accountId, category, effectiveType, refreshToken, retryToken, timeline]);

  function changeCategory(nextCategory: Category) {
    setCategory(nextCategory);
    if (nextCategory === "tap") setTypeFilter("all");
  }

  return (
    <section
      className="grid w-full min-w-0 max-w-full gap-3"
      aria-label="Stats"
    >
      <h2 className="mt-1 mb-2 text-md font-black tracking-tight">Stats</h2>
      <div className="flex flex-wrap items-center gap-2">
        <TechniqueCategoryPillSelect
          value={category}
          onValueChange={changeCategory}
          variant="small"
        />
        <FilterSelect
          ariaLabel="Stats date"
          options={timelineOptions}
          value={timeline}
          onValueChange={(value) => setTimeline(value as StatsTimeline)}
        />
        <FilterSelect
          ariaLabel="Stats type"
          disabled={category === "tap"}
          options={typeOptions}
          value={effectiveType}
          onValueChange={(value) => setTypeFilter(value as StatsTypeFilter)}
        />
      </div>
      {error ? (
        <ErrorState
          message={error}
          onRetry={() => setRetryToken((token) => token + 1)}
        />
      ) : null}
      {isLoading ? (
        <StatsLoadingState />
      ) : stats?.items.length ? (
        <StatsBarList
          category={category}
          data={stats.items}
          typeFilter={effectiveType}
        />
      ) : (
        <EmptyState
          className="bg-transparent px-0"
          body="Technique stats appear after journal entries matching these filters are created."
          onAction={onAddEntry}
          title="No stats yet"
        />
      )}
    </section>
  );
}

function StatsBarList({
  category,
  data,
  typeFilter,
}: {
  category: Category;
  data: StatsDetail["items"];
  typeFilter: StatsTypeFilter;
}) {
  const isTap = category === "tap";
  const color = categoryChartColors[category];
  const rows = withDisplayValues(data, isTap, typeFilter);
  const maxCount = Math.max(...rows.map((row) => row.displayCount), 1);

  return (
    <div className="grid gap-2" aria-label="Technique stats">
      {rows.map((row, index) => {
        const barWidth = `${(row.displayCount / maxCount) * 100}%`;
        const attemptWidth =
          row.displayCount > 0
            ? `${(row.attempts / row.displayCount) * 100}%`
            : "0%";
        const successWidth =
          row.displayCount > 0
            ? `${(row.successes / row.displayCount) * 100}%`
            : "0%";

        return (
          <div key={`${row.label}-${index}`} className="grid min-w-0 gap-1">
            <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3">
              <span className="truncate text-xs font-semibold text-zinc-900">
                {row.label}
              </span>
              <span className="text-[11px] font-semibold text-zinc-500">
                {row.displayLabel}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-xs bg-zinc-100">
              <div
                aria-label={`${row.label}: ${row.displayLabel}`}
                className="flex h-full overflow-hidden rounded-xs"
                style={{ width: barWidth }}
              >
                {!isTap && typeFilter === "all" ? (
                  <span
                    className="h-full"
                    style={{
                      width: attemptWidth,
                      backgroundColor: color,
                      opacity: 0.5,
                    }}
                  />
                ) : null}
                <span
                  className="h-full"
                  style={{
                    width:
                      !isTap && typeFilter === "all" ? successWidth : "100%",
                    backgroundColor: color,
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

type DisplayedStatsItem = StatsDetail["items"][number] & {
  displayCount: number;
  displayLabel: string;
};

function withDisplayValues(
  data: StatsDetail["items"],
  isTap: boolean,
  typeFilter: StatsTypeFilter,
): DisplayedStatsItem[] {
  const counts = data.map((item) =>
    isTap
      ? item.occurrences
      : typeFilter === "success"
        ? item.successes
        : item.attempts + item.successes,
  );
  const total = counts.reduce((sum, count) => sum + count, 0);

  return data.map((item, index) => {
    const count = counts[index];
    const label = `${count} · ${total ? Math.round((count / total) * 100) : 0}%`;

    return {
      ...item,
      displayCount: count,
      displayLabel: label,
    };
  });
}

function FilterSelect({
  ariaLabel,
  disabled = false,
  options,
  value,
  onValueChange,
}: {
  ariaLabel: string;
  disabled?: boolean;
  options: Array<{ value: string; label: string }>;
  value: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <Select disabled={disabled} value={value} onValueChange={onValueChange}>
      <SelectTrigger
        aria-label={ariaLabel}
        className="px-2 max-h-7 py-0 text-[11px] w-fit min-w-28 rounded-full text-xs font-semibold shadow-none"
      >
        <SelectValue />
        <ChevronDown className="size-3.5 shrink-0 text-zinc-500" />
      </SelectTrigger>
      <SelectContent align="start" position="popper">
        {options.map((option) => (
          <SelectItem
            key={option.value}
            className="cursor-pointer text-sm"
            showIndicator={false}
            value={option.value}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function StatsLoadingState() {
  return (
    <div
      aria-label="Loading stats"
      className="grid w-full min-w-0 max-w-full gap-4 overflow-hidden bg-transparent"
    >
      <div className="grid gap-2">
        {[1, 2, 3, 4].map((item) => (
          <div className="grid min-w-0 gap-1" key={item}>
            <div className="grid grid-cols-[minmax(0,1fr)_3rem] gap-3">
              <Skeleton className="h-3 w-full max-w-36" />
              <Skeleton className="h-3 w-full" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
