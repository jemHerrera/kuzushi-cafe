import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { ManagerError } from "@/lib/managers/errors";
import { toNotification } from "@/lib/managers/mappers";
import type { Database } from "@/lib/supabase/database.types";

export class NotificationManager {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async sendJournalEntryAssignmentNotification(params: {
    accountId: string;
    journalEntryId: string;
  }) {
    const { data, error } = await this.supabase.rpc(
      "send_journal_entry_assignment_notification",
      {
        assigning_account_id: params.accountId,
        journal_entry_id: params.journalEntryId,
      },
    );
    if (error || !data) {
      throw new ManagerError(
        "notification_creation_failed",
        error?.message ?? "Could not create notification.",
        500,
      );
    }
    return toNotification(data);
  }

  async getNotifications(params: {
    accountId: string;
    limit: number;
    offset: number;
  }) {
    const { data, error } = await this.supabase
      .from("notifications")
      .select("*")
      .eq("account_id", params.accountId)
      .order("created_date", { ascending: false })
      .range(params.offset, params.offset + Math.max(params.limit, 0) - 1);
    if (error) {
      throw new ManagerError("notifications_failed", error.message, 500);
    }
    return {
      items: (data ?? []).map(toNotification),
      limit: params.limit,
      offset: params.offset,
    };
  }

  async getIndicators(params: { accountId: string }) {
    const [notificationsResult, requestsResult] = await Promise.all([
      this.supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("account_id", params.accountId)
        .eq("is_read", false),
      this.supabase
        .from("training_partner_requests")
        .select("id", { count: "exact", head: true })
        .eq("recipient_account_id", params.accountId),
    ]);

    if (notificationsResult.error || requestsResult.error) {
      throw new ManagerError(
        "notification_indicators_failed",
        notificationsResult.error?.message ??
          requestsResult.error?.message ??
          "Could not load notification indicators.",
        500,
      );
    }

    return {
      hasUnreadNotifications: (notificationsResult.count ?? 0) > 0,
      hasInboundTrainingPartnerRequests: (requestsResult.count ?? 0) > 0,
    };
  }

  async markNotificationAsRead(params: { id: string; accountId: string }) {
    const { data, error } = await this.supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", params.id)
      .eq("account_id", params.accountId)
      .select("*")
      .single();
    if (error || !data) {
      throw new ManagerError(
        "notification_not_found",
        "Notification not found.",
        404,
      );
    }
    return toNotification(data);
  }

  async markAllNotificationsAsRead(params: { accountId: string }) {
    const { error } = await this.supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("account_id", params.accountId)
      .eq("is_read", false);
    if (error) {
      throw new ManagerError("notifications_update_failed", error.message, 500);
    }
    return { updated: true as const };
  }
}
