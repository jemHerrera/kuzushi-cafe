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

    const { data, error } = await this.supabase.rpc(
      "get_private_training_activity",
      {
        account_id: params.accountId,
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

}

function startOfUtcDay(date: Date) {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

function toDateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}
