import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { ManagerError } from "@/lib/managers/errors";
import type { TrainingActivityDetail } from "@/lib/managers/types";
import type { Database } from "@/lib/supabase/database.types";

const DAY_IN_MS = 86_400_000;

export class TrainingActivityManager {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getTrainingActivity(params: {
    accountId: string;
  }): Promise<TrainingActivityDetail> {
    const end = startOfUtcDay(new Date());
    const start = new Date(end);
    start.setUTCFullYear(start.getUTCFullYear() - 1);
    start.setUTCDate(start.getUTCDate() + 1);

    const counts = await this.loadDailyCounts({
      accountId: params.accountId,
      start,
      end,
    });
    const days = [];

    for (
      let timestamp = start.getTime();
      timestamp <= end.getTime();
      timestamp += DAY_IN_MS
    ) {
      const date = toDateOnly(new Date(timestamp));
      days.push({ date, count: counts.get(date) ?? 0 });
    }

    return {
      object: "training_activity",
      accountId: params.accountId,
      startDate: toDateOnly(start),
      endDate: toDateOnly(end),
      totalEntries: days.reduce((total, day) => total + day.count, 0),
      activeDays: days.filter((day) => day.count > 0).length,
      days,
    };
  }

  async getPublicTrainingActivity(params: {
    accountId: string;
    viewerAccountId: string;
  }): Promise<TrainingActivityDetail> {
    const end = startOfUtcDay(new Date());
    const start = new Date(end);
    start.setUTCFullYear(start.getUTCFullYear() - 1);
    start.setUTCDate(start.getUTCDate() + 1);

    const { data, error } = await this.supabase.rpc(
      "get_public_training_activity",
      {
        target_account_id: params.accountId,
        viewer_account_id: params.viewerAccountId,
        activity_start: toDateOnly(start),
        activity_end: toDateOnly(end),
      },
    );
    if (error) {
      throw new ManagerError(
        "training_activity_query_failed",
        error.message,
        500,
      );
    }

    const counts = new Map(
      (data ?? []).map((row) => [row.activity_date, row.entry_count]),
    );
    const days = [];
    for (
      let timestamp = start.getTime();
      timestamp <= end.getTime();
      timestamp += DAY_IN_MS
    ) {
      const date = toDateOnly(new Date(timestamp));
      days.push({ date, count: counts.get(date) ?? 0 });
    }

    return {
      object: "training_activity",
      accountId: params.accountId,
      startDate: toDateOnly(start),
      endDate: toDateOnly(end),
      totalEntries: days.reduce((total, day) => total + day.count, 0),
      activeDays: days.filter((day) => day.count > 0).length,
      days,
    };
  }

  private async loadDailyCounts(params: {
    accountId: string;
    start: Date;
    end: Date;
  }) {
    const pageSize = 1000;
    const counts = new Map<string, number>();
    const endExclusive = new Date(params.end.getTime() + DAY_IN_MS);

    for (let offset = 0; ; offset += pageSize) {
      const { data, error } = await this.supabase
        .from("journal_entries")
        .select("trained_date, created_date")
        .eq("account_id", params.accountId)
        .order("created_date", { ascending: true })
        .order("id", { ascending: true })
        .range(offset, offset + pageSize - 1);

      if (error) {
        throw new ManagerError(
          "training_activity_query_failed",
          error.message,
          500,
        );
      }

      const page = data ?? [];
      for (const entry of page) {
        const occurredAt = entry.trained_date ?? entry.created_date;
        const occurredAtTime = new Date(occurredAt).getTime();
        if (
          occurredAtTime < params.start.getTime() ||
          occurredAtTime >= endExclusive.getTime()
        ) {
          continue;
        }

        const date = occurredAt.slice(0, 10);
        counts.set(date, (counts.get(date) ?? 0) + 1);
      }
      if (page.length < pageSize) break;
    }

    return counts;
  }
}

function startOfUtcDay(date: Date) {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

function toDateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}
