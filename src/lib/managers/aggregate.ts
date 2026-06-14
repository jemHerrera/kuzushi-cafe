import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import {
  eachDayOfInterval,
  eachMonthOfInterval,
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";

import { ManagerError } from "@/lib/managers/errors";
import type {
  AggregateStatsDetail,
  AggregateTimeline,
  Category,
  JournalType,
} from "@/lib/managers/types";
import type { Database } from "@/lib/supabase/database.types";

type JournalRow = Database["public"]["Tables"]["journal_entries"]["Row"];

export class AggregateManager {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getAggregateStats(params: {
    accountId: string;
    category?: Category;
    timeline: AggregateTimeline;
    startDate?: Date;
    endDate?: Date;
    journalTypes?: JournalType[];
  }): Promise<AggregateStatsDetail> {
    const journalTypes = params.journalTypes ?? ["attempt", "success"];
    const today = endOfDay(new Date());
    const interval =
      params.timeline === "all" ? undefined : timelineInterval(params);
    const entries = await this.loadEntries({
      accountId: params.accountId,
      category: params.category,
      start: interval?.start,
      end: interval?.end ?? today,
    });
    const effectiveInterval =
      interval ??
      allTimeInterval(
        entries.flatMap((entry) =>
          entry.trained_date ? [new Date(entry.trained_date)] : [],
        ),
        today,
      );
    const filtered = filterByJournalType(
      entries,
      journalTypes,
      params.category === "tap",
    );
    const attempts = filtered.filter(
      (entry) => entry.journal_type === "attempt",
    ).length;
    const successes = filtered.filter(
      (entry) => entry.journal_type === "success",
    ).length;
    const counts = new Map<string, number>();
    for (const entry of filtered) {
      counts.set(entry.name, (counts.get(entry.name) ?? 0) + 1);
    }

    return {
      object: "aggregate_stats",
      accountId: params.accountId,
      category: params.category,
      timeline: params.timeline,
      startAt: effectiveInterval.start.getTime(),
      endAt: effectiveInterval.end.getTime(),
      journalTypes,
      attempts,
      successes,
      series: createSeries(
        filtered,
        effectiveInterval.start,
        effectiveInterval.end,
        params.timeline,
      ),
      stats: [...counts.entries()]
        .map(([label, count]) => ({
          label,
          count,
          percentage: filtered.length
            ? Math.round((count / filtered.length) * 100)
            : 0,
        }))
        .sort(
          (left, right) =>
            right.count - left.count || left.label.localeCompare(right.label),
        ),
    };
  }

  async getCategoryBreakdown(params: {
    accountId: string;
    timeline: AggregateTimeline;
    startDate?: Date;
    endDate?: Date;
    journalTypes?: JournalType[];
  }) {
    const journalTypes = params.journalTypes ?? ["attempt", "success"];
    const today = endOfDay(new Date());
    const interval =
      params.timeline === "all" ? undefined : timelineInterval(params);
    const loadedEntries = await this.loadEntries({
      accountId: params.accountId,
      start: interval?.start,
      end: interval?.end ?? today,
    });
    const entries = filterByJournalType(loadedEntries, journalTypes, true);
    const effectiveInterval =
      interval ??
      allTimeInterval(
        loadedEntries.flatMap((entry) =>
          entry.trained_date ? [new Date(entry.trained_date)] : [],
        ),
        today,
      );
    const counts = new Map<Category, { attempts: number; successes: number }>();

    for (const entry of entries) {
      const current = counts.get(entry.category) ?? {
        attempts: 0,
        successes: 0,
      };
      if (entry.journal_type === "attempt") current.attempts += 1;
      if (entry.journal_type === "success") current.successes += 1;
      counts.set(entry.category, current);
    }

    return {
      object: "category_breakdown" as const,
      accountId: params.accountId,
      timeline: params.timeline,
      startAt: effectiveInterval.start.getTime(),
      endAt: effectiveInterval.end.getTime(),
      journalTypes,
      items: [...counts.entries()]
        .map(([category, values]) => {
          const count = values.attempts + values.successes;
          return {
            category,
            ...values,
            percentage: entries.length
              ? Math.round((count / entries.length) * 100)
              : 0,
          };
        })
        .sort(
          (left, right) =>
            right.attempts + right.successes - left.attempts - left.successes,
        ),
    };
  }

  private async loadEntries(params: {
    accountId: string;
    category?: Category;
    start?: Date;
    end?: Date;
  }) {
    const pageSize = 1000;
    const entries: JournalRow[] = [];

    for (let offset = 0; ; offset += pageSize) {
      let query = this.supabase
        .from("journal_entries")
        .select("*")
        .eq("account_id", params.accountId)
        .order("trained_date", { ascending: true })
        .order("id", { ascending: true })
        .range(offset, offset + pageSize - 1);
      if (params.start) {
        query = query.gte("trained_date", params.start.toISOString());
      }
      if (params.end) {
        query = query.lte("trained_date", params.end.toISOString());
      }
      if (params.category) query = query.eq("category", params.category);

      const { data, error } = await query;
      if (error) {
        throw new ManagerError("aggregate_query_failed", error.message, 500);
      }

      const page = data ?? [];
      entries.push(...page);
      if (page.length < pageSize) break;
    }

    return entries;
  }
}

function timelineInterval(params: {
  timeline: AggregateTimeline;
  startDate?: Date;
  endDate?: Date;
}) {
  const now = new Date();
  if (params.timeline === "week") {
    return {
      start: startOfWeek(now, { weekStartsOn: 1 }),
      end: endOfWeek(now, { weekStartsOn: 1 }),
    };
  }
  if (params.timeline === "month") {
    return { start: startOfMonth(now), end: endOfMonth(now) };
  }
  if (params.timeline === "year") {
    return { start: startOfYear(now), end: endOfYear(now) };
  }
  if (!params.startDate || !params.endDate) {
    throw new ManagerError(
      "custom_timeline_dates_required",
      "Custom timelines require a start and end date.",
      422,
    );
  }
  const start = startOfDay(params.startDate);
  const end = endOfDay(params.endDate);
  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    start > end
  ) {
    throw new ManagerError(
      "invalid_timeline",
      "Timeline dates are invalid.",
      422,
    );
  }
  return { start, end };
}

function allTimeInterval(dates: Date[], end: Date) {
  const first = dates[0];
  return {
    start: first ? startOfDay(first) : startOfDay(end),
    end,
  };
}

function filterByJournalType(
  entries: JournalRow[],
  journalTypes: JournalType[],
  includeTapEntries: boolean,
) {
  return entries.filter(
    (entry) =>
      (includeTapEntries && entry.category === "tap") ||
      (entry.journal_type !== null &&
        journalTypes.includes(entry.journal_type)),
  );
}

function createSeries(
  entries: JournalRow[],
  start: Date,
  end: Date,
  timeline: AggregateTimeline,
) {
  const useMonths =
    timeline === "all" ||
    timeline === "year" ||
    (timeline === "custom" &&
      (end.getTime() - start.getTime()) / 86_400_000 > 45);
  const buckets = useMonths
    ? eachMonthOfInterval({ start, end })
    : eachDayOfInterval({ start, end });

  return buckets.map((bucket) => {
    const matching = entries.filter((entry) => {
      if (!entry.trained_date) return false;
      return useMonths
        ? isSameMonth(new Date(entry.trained_date), bucket)
        : isSameDay(new Date(entry.trained_date), bucket);
    });
    return {
      label: format(
        bucket,
        timeline === "all" ? "MMM yyyy" : useMonths ? "MMM" : "MMM d",
      ),
      attempts: matching.filter((entry) => entry.journal_type === "attempt")
        .length,
      successes: matching.filter((entry) => entry.journal_type === "success")
        .length,
      occurrences: matching.length,
    };
  });
}
