import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { ManagerError } from "@/lib/managers/errors";
import type {
  Category,
  StatsDetail,
  StatsTimeline,
  StatsTypeFilter,
} from "@/lib/managers/types";
import type { Database } from "@/lib/supabase/database.types";

type StatsRow = Pick<
  Database["public"]["Tables"]["journal_entries"]["Row"],
  "created_date" | "journal_type" | "name" | "trained_date"
>;

export class StatsManager {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getStats(params: {
    accountId: string;
    category: Category;
    timeline: StatsTimeline;
    type: StatsTypeFilter;
  }): Promise<StatsDetail> {
    const interval = statsInterval(params.timeline);
    const effectiveType = params.category === "tap" ? "all" : params.type;
    const rows = await this.loadEntries({
      accountId: params.accountId,
      category: params.category,
    });
    const counts = new Map<
      string,
      StatsDetail["items"][number] & { firstIndex: number }
    >();

    rows.forEach((row, index) => {
      const occurredAt = new Date(row.trained_date ?? row.created_date);
      if (
        occurredAt < interval.start ||
        occurredAt >= interval.endExclusive ||
        (params.category !== "tap" &&
          (row.journal_type === null ||
            (effectiveType === "success" && row.journal_type !== "success")))
      ) {
        return;
      }

      const label = row.name.trim();
      const key = normalizeTechniqueName(label);
      const item = counts.get(key) ?? {
        label,
        attempts: 0,
        successes: 0,
        occurrences: 0,
        firstIndex: index,
      };
      if (label < item.label) item.label = label;
      item.occurrences += 1;
      if (row.journal_type === "attempt") item.attempts += 1;
      if (row.journal_type === "success") item.successes += 1;
      counts.set(key, item);
    });

    return {
      object: "stats",
      accountId: params.accountId,
      category: params.category,
      timeline: params.timeline,
      type: effectiveType,
      ...(params.timeline === "all"
        ? {}
        : { startDate: toDateOnly(interval.start) }),
      endDate: toDateOnly(new Date(interval.endExclusive.getTime() - 1)),
      items: [...counts.values()]
        .sort(
          (left, right) =>
            displayedCount(right, params.category, effectiveType) -
              displayedCount(left, params.category, effectiveType) ||
            left.label.localeCompare(right.label, undefined, {
              sensitivity: "base",
            }) ||
            left.firstIndex - right.firstIndex,
        )
        .map((item) => ({
          label: item.label,
          attempts: item.attempts,
          successes: item.successes,
          occurrences: item.occurrences,
        })),
    };
  }

  async getPublicStats(params: {
    accountId: string;
    viewerAccountId: string;
    category: Category;
    timeline: StatsTimeline;
    type: StatsTypeFilter;
  }): Promise<StatsDetail> {
    const interval = statsInterval(params.timeline);
    const effectiveType = params.category === "tap" ? "all" : params.type;
    const { data, error } = await this.supabase.rpc("get_public_stats", {
      target_account_id: params.accountId,
      viewer_account_id: params.viewerAccountId,
      stats_category: params.category,
      stats_start: interval.start.toISOString(),
      stats_end_exclusive: interval.endExclusive.toISOString(),
      successes_only: effectiveType === "success",
    });
    if (error) {
      throw new ManagerError("stats_query_failed", error.message, 500);
    }

    const items = (data ?? [])
      .map((row) => ({
        label: row.label,
        attempts: row.attempts,
        successes: row.successes,
        occurrences: row.occurrences,
      }))
      .sort(
        (left, right) =>
          displayedCount(right, params.category, effectiveType) -
            displayedCount(left, params.category, effectiveType) ||
          left.label.localeCompare(right.label, undefined, {
            sensitivity: "base",
          }),
      );

    return {
      object: "stats",
      accountId: params.accountId,
      category: params.category,
      timeline: params.timeline,
      type: effectiveType,
      ...(params.timeline === "all"
        ? {}
        : { startDate: toDateOnly(interval.start) }),
      endDate: toDateOnly(new Date(interval.endExclusive.getTime() - 1)),
      items,
    };
  }

  private async loadEntries(params: { accountId: string; category: Category }) {
    const pageSize = 1000;
    const entries: StatsRow[] = [];

    for (let offset = 0; ; offset += pageSize) {
      const { data, error } = await this.supabase
        .from("journal_entries")
        .select("name, journal_type, trained_date, created_date")
        .eq("account_id", params.accountId)
        .eq("category", params.category)
        .order("created_date", { ascending: true })
        .order("id", { ascending: true })
        .range(offset, offset + pageSize - 1);

      if (error) {
        throw new ManagerError("stats_query_failed", error.message, 500);
      }

      const page = data ?? [];
      entries.push(...page);
      if (page.length < pageSize) break;
    }

    return entries;
  }
}

function statsInterval(timeline: StatsTimeline) {
  const now = new Date();
  const endExclusive = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1),
  );

  if (timeline === "all") {
    return { start: new Date(0), endExclusive };
  }

  if (timeline === "week") {
    const start = new Date(endExclusive.getTime() - 86_400_000);
    const day = start.getUTCDay();
    start.setUTCDate(start.getUTCDate() - (day === 0 ? 6 : day - 1));
    return { start, endExclusive };
  }

  if (timeline === "month") {
    return {
      start: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)),
      endExclusive,
    };
  }

  return {
    start: new Date(Date.UTC(now.getUTCFullYear(), 0, 1)),
    endExclusive,
  };
}

function displayedCount(
  item: StatsDetail["items"][number],
  category: Category,
  type: StatsTypeFilter,
) {
  if (category === "tap") return item.occurrences;
  if (type === "success") return item.successes;
  return item.attempts + item.successes;
}

function normalizeTechniqueName(value: string) {
  return value.trim().toLocaleLowerCase();
}

function toDateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}
