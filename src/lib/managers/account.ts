import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { toAccountDetail } from "@/lib/auth/account";
import { assertManagerResult, ManagerError } from "@/lib/managers/errors";
import { toPrivacySettings } from "@/lib/managers/mappers";
import type {
  AccountDetail,
  AccountPrivacySettings,
  AgeClass,
  AuthProvider,
  Belt,
  PrivacyType,
  PublicAccountSummary,
  PublicProfileDetail,
  TrainingPartnerDetail,
  TrainingPartnerRelationshipStatus,
  WeightClass,
} from "@/lib/managers/types";
import type { Database } from "@/lib/supabase/database.types";

type PrivacyOptions = Partial<{
  journalEntries: PrivacyType;
  activity: PrivacyType;
  stats: PrivacyType;
}>;

export class AccountManager {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async createAccount(params: {
    authUserId: string;
    email: string;
    authProvider: AuthProvider;
  }): Promise<AccountDetail> {
    const { data, error } = await this.supabase
      .from("accounts")
      .insert({
        auth_user_id: params.authUserId,
        auth_provider: params.authProvider,
        email: params.email.trim().toLowerCase(),
      })
      .select("*")
      .single();

    return toAccountDetail(
      assertManagerResult(
        data,
        error,
        "account_creation_failed",
        "Could not create account.",
      ),
    );
  }

  async getAccount(params: { id: string }): Promise<AccountDetail> {
    const { data, error } = await this.supabase
      .from("accounts")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error || !data) {
      throw new ManagerError("account_not_found", "Account not found.", 404);
    }

    return toAccountDetail(data);
  }

  async updateAccount(params: {
    firstName?: string;
    lastName?: string;
    bio?: string;
    profilePhoto?: string;
    belt?: Belt;
    weight?: WeightClass;
    birthday?: Date;
  }): Promise<AccountDetail> {
    const currentId = await this.currentAccountId();
    const { data, error } = await this.supabase
      .from("accounts")
      .update({
        ...(params.firstName !== undefined && {
          first_name: cleanOptionalText(params.firstName),
        }),
        ...(params.lastName !== undefined && {
          last_name: cleanOptionalText(params.lastName),
        }),
        ...(params.bio !== undefined && {
          bio: cleanOptionalText(params.bio),
        }),
        ...(params.profilePhoto !== undefined && {
          profile_photo: cleanOptionalText(params.profilePhoto),
        }),
        ...(params.belt !== undefined && { belt: params.belt }),
        ...(params.weight !== undefined && { weight: params.weight }),
        ...(params.birthday !== undefined && {
          birthday: toDateOnly(params.birthday),
        }),
      })
      .eq("id", currentId)
      .select("*")
      .single();

    return toAccountDetail(
      assertManagerResult(
        data,
        error,
        "account_update_failed",
        "Could not update account.",
      ),
    );
  }

  async getPrivacySettings(params: {
    accountId: string;
  }): Promise<AccountPrivacySettings> {
    const { data, error } = await this.supabase
      .from("account_privacy_settings")
      .select("*")
      .eq("account_id", params.accountId)
      .single();

    return toPrivacySettings(
      assertManagerResult(
        data,
        error,
        "privacy_settings_not_found",
        "Privacy settings not found.",
      ),
    );
  }

  async updatePrivacySettings(params: {
    accountId: string;
    options: PrivacyOptions;
  }): Promise<AccountPrivacySettings> {
    const { data, error } = await this.supabase
      .from("account_privacy_settings")
      .update({
        ...(params.options.journalEntries && {
          journal_entries: params.options.journalEntries,
        }),
        ...(params.options.activity && { activity: params.options.activity }),
        ...(params.options.stats && { stats: params.options.stats }),
      })
      .eq("account_id", params.accountId)
      .select("*")
      .single();

    return toPrivacySettings(
      assertManagerResult(
        data,
        error,
        "privacy_settings_update_failed",
        "Could not update privacy settings.",
      ),
    );
  }

  async searchPublicProfiles(params: {
    viewerAccountId?: string;
    search?: string;
    limit: number;
    offset: number;
  }) {
    const { data, error } = await this.supabase.rpc("search_public_profiles", {
      viewer_account_id: params.viewerAccountId,
      search_text: params.search ?? "",
      result_limit: params.limit,
      result_offset: params.offset,
    });

    if (error) {
      throw new ManagerError(
        "public_profile_search_failed",
        error.message,
        500,
      );
    }

    return {
      items: (data ?? []).map(toPublicAccountSummary),
      limit: params.limit,
      offset: params.offset,
    };
  }

  async getPublicProfile(params: {
    accountId: string;
    viewerAccountId: string;
  }): Promise<PublicProfileDetail> {
    const { data, error } = await this.supabase.rpc("get_public_profile", {
      target_account_id: params.accountId,
      viewer_account_id: params.viewerAccountId,
    });
    const row = data?.[0];
    if (error || !row) {
      throw new ManagerError(
        "public_profile_not_found",
        "Profile not found.",
        404,
      );
    }
    return {
      ...toPublicAccountSummary(row),
      visibility: {
        journalEntries: row.can_view_journal_entries,
        activity: row.can_view_activity,
        stats: row.can_view_stats,
      },
    };
  }

  async sendTrainingPartnerRequest(params: {
    fromAccountId: string;
    toAccountId: string;
  }) {
    const { error } = await this.supabase.rpc("send_training_partner_request", {
      requester_account_id: params.fromAccountId,
      recipient_account_id: params.toAccountId,
    });

    if (error) {
      throw new ManagerError("request_failed", error.message, 409);
    }

    return { sent: true as const };
  }

  async acceptTrainingPartnerRequest(params: {
    accountId: string;
    requesterAccountId: string;
  }) {
    const { error } = await this.supabase.rpc(
      "accept_training_partner_request",
      {
        accepting_account_id: params.accountId,
        requester_id: params.requesterAccountId,
      },
    );

    if (error) {
      throw new ManagerError("request_accept_failed", error.message, 409);
    }

    return { accepted: true as const };
  }

  async cancelTrainingPartnerRequest(params: {
    fromAccountId: string;
    toAccountId: string;
  }) {
    const { error } = await this.supabase
      .from("training_partner_requests")
      .delete()
      .eq("requester_account_id", params.fromAccountId)
      .eq("recipient_account_id", params.toAccountId);

    if (error) {
      throw new ManagerError("request_cancel_failed", error.message, 500);
    }

    return { canceled: true as const };
  }

  async removeTrainingPartner(params: {
    accountId: string;
    trainingPartnerId: string;
  }) {
    const { data: ownedPartner } = await this.supabase
      .from("training_partners")
      .select("id")
      .eq("id", params.trainingPartnerId)
      .eq("owner_account_id", params.accountId)
      .maybeSingle();
    if (!ownedPartner) {
      throw new ManagerError(
        "training_partner_not_found",
        "Training partner not found.",
        404,
      );
    }
    const { error } = await this.supabase.rpc("detach_training_partner", {
      account_id: params.accountId,
      training_partner_id: params.trainingPartnerId,
    });

    if (error) {
      throw new ManagerError("partner_remove_failed", error.message, 500);
    }

    return { removed: true as const };
  }

  async blockAccount(params: { accountId: string; blockedAccountId: string }) {
    const { error } = await this.supabase.rpc("block_account", {
      account_id: params.accountId,
      blocked_account_id: params.blockedAccountId,
    });

    if (error) {
      throw new ManagerError("account_block_failed", error.message, 500);
    }

    return { blocked: true as const };
  }

  async unblockAccount(params: {
    accountId: string;
    blockedAccountId: string;
  }) {
    const { error } = await this.supabase.rpc("unblock_account", {
      account_id: params.accountId,
      blocked_account_id: params.blockedAccountId,
    });

    if (error) {
      throw new ManagerError("account_unblock_failed", error.message, 500);
    }

    return { unblocked: true as const };
  }

  async getTrainingPartnerRelationshipStatus(params: {
    accountId: string;
    otherAccountId: string;
  }): Promise<{ status: TrainingPartnerRelationshipStatus }> {
    const { data, error } = await this.supabase.rpc(
      "training_partner_relationship_status",
      {
        viewer_account_id: params.accountId,
        other_account_id: params.otherAccountId,
      },
    );

    if (error || !isRelationshipStatus(data)) {
      throw new ManagerError(
        "relationship_status_failed",
        error?.message ?? "Could not determine relationship status.",
        500,
      );
    }

    return { status: data };
  }

  async getTrainingPartnerRequests(params: {
    accountId: string;
    direction: "inbound" | "outbound";
    limit: number;
    offset: number;
  }) {
    const { data, error } = await this.supabase.rpc(
      "list_training_partner_requests",
      {
        account_id: params.accountId,
        request_direction: params.direction,
        result_limit: params.limit,
        result_offset: params.offset,
      },
    );

    if (error) {
      throw new ManagerError("partner_requests_failed", error.message, 500);
    }

    return {
      items: (data ?? []).map((row) => ({
        id: row.id,
        object: "account" as const,
        firstName: row.first_name ?? undefined,
        lastName: row.last_name ?? undefined,
        bio: row.bio ?? undefined,
        email: row.email,
        profilePhoto: row.profile_photo ?? undefined,
        belt: row.belt,
        weight: row.weight,
        birthday: row.birthday
          ? new Date(`${row.birthday}T00:00:00Z`).getTime()
          : undefined,
        donated: row.donated,
        createdAt: new Date(row.created_date).getTime(),
        updatedAt: new Date(row.updated_date).getTime(),
      })),
      limit: params.limit,
      offset: params.offset,
    };
  }

  async getTrainingPartners(params: {
    accountId: string;
    search?: string;
    limit: number;
    offset: number;
  }) {
    const { data, error } = await this.supabase.rpc("list_training_partners", {
      account_id: params.accountId,
      search_text: params.search ?? "",
      result_limit: params.limit,
      result_offset: params.offset,
    });

    if (error) {
      throw new ManagerError("training_partners_failed", error.message, 500);
    }

    return {
      items: (data ?? []).map(
        (row): TrainingPartnerDetail =>
          row.is_account_backed
            ? {
                id: row.id,
                object: "training_partner",
                accountId: row.partner_account_id!,
                firstName: row.first_name ?? undefined,
                lastName: row.last_name ?? undefined,
                profilePhoto: row.profile_photo ?? undefined,
                belt: row.partner_belt ?? "unknown",
                weight: row.partner_weight ?? "unknown",
                createdAt: new Date(row.created_date).getTime(),
                updatedAt: new Date(row.updated_date).getTime(),
              }
            : {
                id: row.id,
                object: "custom_training_partner",
                firstName: row.first_name ?? undefined,
                lastName: row.last_name ?? undefined,
                weight: row.partner_weight ?? undefined,
                age: row.partner_age ?? undefined,
                belt: row.partner_belt ?? undefined,
                createdAt: new Date(row.created_date).getTime(),
                updatedAt: new Date(row.updated_date).getTime(),
              },
      ),
      limit: params.limit,
      offset: params.offset,
    };
  }

  searchTrainingPartners(params: {
    accountId: string;
    search: string;
    limit: number;
    offset: number;
  }) {
    return this.getTrainingPartners(params);
  }

  async createCustomTrainingPartner(params: {
    accountId: string;
    firstName?: string;
    lastName?: string;
    partnerWeight?: WeightClass;
    partnerAge?: AgeClass;
    partnerBelt?: Belt;
  }): Promise<TrainingPartnerDetail> {
    if (
      !params.firstName &&
      !params.lastName &&
      !params.partnerWeight &&
      !params.partnerAge &&
      !params.partnerBelt
    ) {
      throw new ManagerError(
        "partner_details_required",
        "At least one custom partner detail is required.",
        422,
      );
    }

    const { data, error } = await this.supabase
      .from("training_partners")
      .insert({
        owner_account_id: params.accountId,
        first_name: cleanOptionalText(params.firstName),
        last_name: cleanOptionalText(params.lastName),
        partner_weight: params.partnerWeight,
        partner_age: params.partnerAge,
        partner_belt: params.partnerBelt,
      })
      .select("*")
      .single();

    const row = assertManagerResult(
      data,
      error,
      "custom_partner_creation_failed",
      "Could not create custom training partner.",
    );

    return {
      id: row.id,
      object: "custom_training_partner",
      firstName: row.first_name ?? undefined,
      lastName: row.last_name ?? undefined,
      weight: row.partner_weight ?? undefined,
      age: row.partner_age ?? undefined,
      belt: row.partner_belt ?? undefined,
      createdAt: new Date(row.created_date).getTime(),
      updatedAt: new Date(row.updated_date).getTime(),
    };
  }

  async updateCustomTrainingPartner(params: {
    accountId: string;
    trainingPartnerId: string;
    firstName?: string | null;
    lastName?: string | null;
    partnerWeight?: WeightClass | null;
    partnerAge?: AgeClass | null;
    partnerBelt?: Belt | null;
  }): Promise<TrainingPartnerDetail> {
    const { data: existing, error: lookupError } = await this.supabase
      .from("training_partners")
      .select("id, partner_account_id")
      .eq("id", params.trainingPartnerId)
      .eq("owner_account_id", params.accountId)
      .maybeSingle();

    if (lookupError) {
      throw new ManagerError(
        "training_partner_lookup_failed",
        lookupError.message,
        500,
      );
    }

    if (!existing) {
      throw new ManagerError(
        "training_partner_not_found",
        "Training partner not found.",
        404,
      );
    }

    if (existing.partner_account_id) {
      throw new ManagerError(
        "account_partner_not_editable",
        "Registered training partner details are managed by their profile.",
        409,
      );
    }

    const { data, error } = await this.supabase
      .from("training_partners")
      .update({
        first_name: cleanOptionalText(params.firstName ?? undefined),
        last_name: cleanOptionalText(params.lastName ?? undefined),
        partner_weight: params.partnerWeight,
        partner_age: params.partnerAge,
        partner_belt: params.partnerBelt,
      })
      .eq("id", params.trainingPartnerId)
      .eq("owner_account_id", params.accountId)
      .is("partner_account_id", null)
      .select("*")
      .single();

    const row = assertManagerResult(
      data,
      error,
      "custom_partner_update_failed",
      "Could not update custom training partner.",
    );

    return {
      id: row.id,
      object: "custom_training_partner",
      firstName: row.first_name ?? undefined,
      lastName: row.last_name ?? undefined,
      weight: row.partner_weight ?? undefined,
      age: row.partner_age ?? undefined,
      belt: row.partner_belt ?? undefined,
      createdAt: new Date(row.created_date).getTime(),
      updatedAt: new Date(row.updated_date).getTime(),
    };
  }

  async getPotentialTrainingPartners(params: {
    accountId: string;
    search?: string;
    limit: number;
    offset: number;
  }) {
    const result = await this.searchPublicProfiles({
      viewerAccountId: params.accountId,
      search: params.search,
      limit: 100,
      offset: 0,
    });
    const items = result.items.filter(
      (item) =>
        item.relationshipStatus === "none" ||
        item.relationshipStatus === "removed",
    );

    return {
      items: items.slice(params.offset, params.offset + params.limit),
      limit: params.limit,
      offset: params.offset,
    };
  }

  searchPotentialTrainingPartners(params: {
    accountId: string;
    search: string;
    limit: number;
    offset: number;
  }) {
    return this.getPotentialTrainingPartners(params);
  }

  private async currentAccountId() {
    const { data, error } = await this.supabase.rpc("current_account_id");
    if (error || !data) {
      throw new ManagerError(
        "authentication_required",
        "An authenticated account is required.",
        401,
      );
    }
    return data;
  }
}

function cleanOptionalText(value?: string) {
  const cleaned = value?.trim();
  return cleaned || null;
}

function toDateOnly(value: Date) {
  if (Number.isNaN(value.getTime()) || value.getTime() > Date.now()) {
    throw new ManagerError(
      "invalid_birthday",
      "Birthday must be a valid date that is not in the future.",
      422,
    );
  }
  return value.toISOString().slice(0, 10);
}

function toPublicAccountSummary(
  row: Database["public"]["Functions"]["search_public_profiles"]["Returns"][number],
): PublicAccountSummary {
  return {
    id: row.id,
    object: "public_account_summary",
    firstName: row.first_name ?? undefined,
    lastName: row.last_name ?? undefined,
    bio: row.bio ?? undefined,
    profilePhoto: row.profile_photo ?? undefined,
    belt: row.belt ?? undefined,
    donated: row.donated,
    relationshipStatus: isRelationshipStatus(row.relationship_status)
      ? row.relationship_status
      : undefined,
  };
}

function isRelationshipStatus(
  value: unknown,
): value is TrainingPartnerRelationshipStatus {
  return (
    typeof value === "string" &&
    [
      "none",
      "pending-inbound",
      "pending-outbound",
      "accepted",
      "blocked",
      "removed",
    ].includes(value)
  );
}
