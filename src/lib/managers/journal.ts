import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { ManagerError } from "@/lib/managers/errors";
import { toJournalEntry, toTechniqueTag } from "@/lib/managers/mappers";
import type {
  AgeClass,
  Belt,
  Category,
  Intensity,
  JournalEntryDetail,
  JournalEntryFilters,
  JournalEntrySort,
  JournalType,
  TechniqueTagDetail,
  WeightClass,
} from "@/lib/managers/types";
import type { Database } from "@/lib/supabase/database.types";

type PartnerInput = {
  trainingPartnerId?: string | null;
  partnerFirstName?: string;
  partnerLastName?: string;
  partnerWeight?: WeightClass;
  partnerAge?: AgeClass;
  partnerBelt?: Belt;
};

type JournalValues = PartnerInput & {
  name: string;
  category: Category;
  setup?: string;
  journalType?: JournalType;
  notes?: string;
  intensity?: Intensity;
  isNoGi?: boolean;
  trainedDate?: Date;
};

type JournalUpdate = PartnerInput &
  Partial<
    Omit<
      JournalValues,
      | keyof PartnerInput
      | "setup"
      | "journalType"
      | "notes"
      | "intensity"
      | "isNoGi"
      | "trainedDate"
    >
  > & {
    setup?: string | null;
    journalType?: JournalType | null;
    notes?: string | null;
    intensity?: Intensity | null;
    isNoGi?: boolean | null;
    trainedDate?: Date | null;
  };

type JournalRow = Database["public"]["Tables"]["journal_entries"]["Row"];
type PartnerProfile = {
  firstName?: string;
  lastName?: string;
  profilePhoto?: string;
  belt?: Belt;
  weight?: WeightClass;
};

export class JournalEntryManager {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async createJournalEntry(
    params: JournalValues & { accountId: string },
  ): Promise<JournalEntryDetail> {
    validateText(params.name, "Technique");
    validatePartnerMode(params);

    let createdCustomPartnerId: string | undefined;
    let trainingPartnerId = params.trainingPartnerId;

    if (trainingPartnerId) {
      await this.assertOwnedPartner(params.accountId, trainingPartnerId);
    }

    if (hasCustomPartner(params)) {
      createdCustomPartnerId = await this.createCustomPartner(
        params.accountId,
        params,
      );
      trainingPartnerId = createdCustomPartnerId;
    }

    const now = new Date();
    if (params.trainedDate) validateDate(params.trainedDate, "Trained date");

    const { data, error } = await this.supabase
      .from("journal_entries")
      .insert({
        account_id: params.accountId,
        name: params.name.trim(),
        category: params.category,
        setup: cleanText(params.setup),
        journal_type:
          params.category === "tap" ? null : (params.journalType ?? null),
        notes: cleanText(params.notes),
        intensity: params.intensity ?? null,
        is_no_gi: params.isNoGi ?? null,
        training_partner_id: trainingPartnerId ?? null,
        trained_date: params.trainedDate?.toISOString() ?? null,
        created_date: now.toISOString(),
      })
      .select("*")
      .single();

    if (error || !data) {
      if (createdCustomPartnerId) {
        await this.supabase
          .from("training_partners")
          .delete()
          .eq("id", createdCustomPartnerId);
      }
      throw new ManagerError(
        "journal_entry_creation_failed",
        error?.message ?? "Could not create journal entry.",
        500,
      );
    }

    return this.withPartner(data);
  }

  async updateJournalEntry(params: {
    accountId: string;
    id: string;
    options: JournalUpdate;
  }): Promise<JournalEntryDetail> {
    const existing = await this.getJournalRow(params.id, params.accountId);
    const options = params.options;
    const category = options.category ?? existing.category;

    if (options.name !== undefined) validateText(options.name, "Technique");
    validatePartnerMode(options);

    let trainingPartnerId: string | null | undefined;
    if (options.trainingPartnerId) {
      await this.assertOwnedPartner(
        existing.account_id,
        options.trainingPartnerId,
      );
      trainingPartnerId = options.trainingPartnerId;
    } else if (hasCustomPartner(options)) {
      trainingPartnerId = await this.createCustomPartner(
        existing.account_id,
        options,
      );
    } else if (options.trainingPartnerId === null) {
      trainingPartnerId = null;
    }

    if (options.trainedDate) {
      validateDate(options.trainedDate, "Trained date");
    }

    const { data, error } = await this.supabase
      .from("journal_entries")
      .update({
        ...(options.name !== undefined && { name: options.name.trim() }),
        ...(options.category !== undefined && { category: options.category }),
        ...(options.setup !== undefined && { setup: cleanText(options.setup) }),
        ...(category === "tap"
          ? { journal_type: null }
          : options.journalType !== undefined
            ? { journal_type: options.journalType }
            : {}),
        ...(options.notes !== undefined && {
          notes: cleanText(options.notes),
        }),
        ...(options.intensity !== undefined && {
          intensity: options.intensity,
        }),
        ...(options.isNoGi !== undefined && { is_no_gi: options.isNoGi }),
        ...(trainingPartnerId !== undefined && {
          training_partner_id: trainingPartnerId,
        }),
        ...(options.trainedDate !== undefined && {
          trained_date: options.trainedDate?.toISOString() ?? null,
        }),
      })
      .eq("id", params.id)
      .select("*")
      .single();

    if (error || !data) {
      if (trainingPartnerId && !options.trainingPartnerId) {
        await this.supabase
          .from("training_partners")
          .delete()
          .eq("id", trainingPartnerId);
      }
      throw new ManagerError(
        "journal_entry_update_failed",
        error?.message ?? "Could not update journal entry.",
        500,
      );
    }

    return this.withPartner(data);
  }

  async getJournalEntry(params: { id: string; accountId: string }) {
    return this.withPartner(
      await this.getJournalRow(params.id, params.accountId),
    );
  }

  async getJournalEntries(params: {
    accountId: string;
    filter: JournalEntryFilters;
    sort?: JournalEntrySort;
    limit: number;
    offset: number;
  }) {
    const sort = params.sort ?? { field: "trainedAt", direction: "desc" };
    if (sort.field === "trainingPartner") {
      const { data, error } = await this.supabase.rpc(
        "list_private_journal_entries_by_partner",
        {
          account_id: params.accountId,
          search: params.filter.search?.trim() || undefined,
          categories: params.filter.category?.length
            ? params.filter.category
            : undefined,
          journal_types: params.filter.journalTypes?.length
            ? params.filter.journalTypes
            : undefined,
          is_no_gi: params.filter.isNoGi ?? undefined,
          sort_ascending: sort.direction === "asc",
          page_limit: params.limit,
          page_offset: params.offset,
        },
      );
      if (error) {
        throw new ManagerError("journal_entries_failed", error.message, 500);
      }

      return {
        items: await this.withPartners(data ?? []),
        limit: params.limit,
        offset: params.offset,
      };
    }

    let query = this.supabase
      .from("journal_entries")
      .select("*")
      .eq("account_id", params.accountId);

    if (params.filter.search?.trim()) {
      const search = escapeLike(params.filter.search.trim());
      query = query.or(`name.ilike.%${search}%,setup.ilike.%${search}%`);
    }
    if (params.filter.category?.length) {
      query = query.in("category", params.filter.category);
    }
    if (params.filter.journalTypes?.length) {
      query = query.in("journal_type", params.filter.journalTypes);
    }
    if (params.filter.isNoGi !== undefined) {
      query = query.eq("is_no_gi", params.filter.isNoGi);
    }

    query = query
      .order(sortColumn(sort.field), {
        ascending: sort.direction === "asc",
        nullsFirst: false,
      })
      .range(params.offset, params.offset + Math.max(0, params.limit) - 1);

    const { data, error } = await query;
    if (error) {
      throw new ManagerError("journal_entries_failed", error.message, 500);
    }

    return {
      items: await this.withPartners(data ?? []),
      limit: params.limit,
      offset: params.offset,
    };
  }

  searchJournalEntries(params: {
    accountId: string;
    search: string;
    filter?: Omit<JournalEntryFilters, "search">;
    sort?: JournalEntrySort;
    limit: number;
    offset: number;
  }) {
    return this.getJournalEntries({
      ...params,
      filter: { ...params.filter, search: params.search },
    });
  }

  async deleteJournalEntries(params: { id: string[]; accountId: string }) {
    if (!params.id.length) return { deleted: true as const };
    const { data: owned } = await this.supabase
      .from("journal_entries")
      .select("id")
      .in("id", params.id)
      .eq("account_id", params.accountId);
    if (owned?.length !== new Set(params.id).size) {
      throw new ManagerError(
        "journal_entry_not_found",
        "Journal entry not found.",
        404,
      );
    }
    const { error } = await this.supabase
      .from("journal_entries")
      .delete()
      .in("id", params.id)
      .eq("account_id", params.accountId);
    if (error) {
      throw new ManagerError("journal_entry_delete_failed", error.message, 500);
    }
    return { deleted: true as const };
  }

  async assignTrainingPartnerToJournalEntry(params: {
    accountId: string;
    trainingPartnerId: string;
    journalEntryId: string;
  }) {
    const { data: partner, error: partnerError } = await this.supabase
      .from("training_partners")
      .select("id")
      .eq("id", params.trainingPartnerId)
      .eq("owner_account_id", params.accountId)
      .not("partner_account_id", "is", null)
      .single();

    if (partnerError || !partner) {
      throw new ManagerError(
        "accepted_partner_required",
        "The journal entry must reference an accepted training partner.",
        422,
      );
    }

    const { data, error } = await this.supabase
      .from("journal_entries")
      .update({ training_partner_id: params.trainingPartnerId })
      .eq("id", params.journalEntryId)
      .eq("account_id", params.accountId)
      .select("*")
      .single();

    if (error || !data) {
      throw new ManagerError(
        "partner_assignment_failed",
        error?.message ?? "Could not assign training partner.",
        500,
      );
    }
    return this.withPartner(data);
  }

  async isAcceptedTrainingPartner(params: {
    accountId: string;
    trainingPartnerId: string;
  }) {
    const { data, error } = await this.supabase
      .from("training_partners")
      .select("id")
      .eq("id", params.trainingPartnerId)
      .eq("owner_account_id", params.accountId)
      .not("partner_account_id", "is", null)
      .maybeSingle();
    if (error) {
      throw new ManagerError(
        "training_partner_lookup_failed",
        error.message,
        500,
      );
    }
    return Boolean(data);
  }

  async createTag(params: {
    category: Category;
    generatedBy: string;
    label: string;
    isPublic?: boolean;
  }): Promise<TechniqueTagDetail> {
    validateText(params.label, "Tag label");
    if (params.isPublic) {
      throw new ManagerError(
        "public_tag_forbidden",
        "User-created tags must be private.",
        403,
      );
    }

    const label = params.label.trim();
    const { data: existingTags, error: existingTagsError } = await this.supabase
      .from("technique_tags")
      .select("label")
      .eq("category", params.category)
      .or(`is_public.eq.true,generated_by_account_id.eq.${params.generatedBy}`);
    if (existingTagsError) {
      throw new ManagerError("tags_failed", existingTagsError.message, 500);
    }
    if (
      existingTags?.some(
        (tag) => normalizeTagLabel(tag.label) === normalizeTagLabel(label),
      )
    ) {
      throw new ManagerError(
        "tag_already_exists",
        "A saved technique with this label and category already exists.",
        409,
      );
    }

    const { data, error } = await this.supabase
      .from("technique_tags")
      .insert({
        key: createTagKey(label),
        label,
        category: params.category,
        generated_by_account_id: params.generatedBy,
        is_public: false,
      })
      .select("*")
      .single();

    if (error || !data) {
      throw new ManagerError(
        "tag_creation_failed",
        error?.message ?? "Could not create tag.",
        409,
      );
    }
    return toTechniqueTag(data);
  }

  async getTags(params: {
    filter: { search?: string; category?: Category; accountId?: string };
    scope?: "visible" | "owned";
    sort?: {
      field: "label" | "category" | "createdAt";
      direction: "asc" | "desc";
    };
    limit: number;
    offset: number;
  }) {
    let query = this.supabase.from("technique_tags").select("*");
    if (params.scope === "owned" && params.filter.accountId) {
      query = query
        .eq("is_public", false)
        .eq("generated_by_account_id", params.filter.accountId);
    } else if (params.filter.accountId) {
      query = query.or(
        `is_public.eq.true,generated_by_account_id.eq.${params.filter.accountId}`,
      );
    } else {
      query = query.eq("is_public", true);
    }
    if (params.filter.category) {
      query = query.eq("category", params.filter.category);
    }

    const { data, error } = await query.limit(1000);
    if (error) {
      throw new ManagerError("tags_failed", error.message, 500);
    }

    const search = params.filter.search?.trim();
    const sort = params.sort ?? { field: "label", direction: "asc" };
    const direction = sort.direction === "asc" ? 1 : -1;
    const rows = (data ?? [])
      .map((row) => ({
        row,
        score: search ? fuzzyScore(row.label, search) : 0,
      }))
      .filter((item) => !search || item.score < Number.POSITIVE_INFINITY)
      .sort((left, right) => {
        if (search && left.score !== right.score) {
          return left.score - right.score;
        }
        return compareTags(left.row, right.row, sort.field) * direction;
      })
      .slice(params.offset, params.offset + params.limit)
      .map(({ row }) => toTechniqueTag(row));

    return { items: rows, limit: params.limit, offset: params.offset };
  }

  searchSavedTechniqueTags(params: {
    accountId: string;
    search: string;
    category?: Category;
    limit: number;
    offset: number;
  }) {
    return this.getTags({
      filter: {
        accountId: params.accountId,
        search: params.search,
        category: params.category,
      },
      limit: params.limit,
      offset: params.offset,
    });
  }

  async updateTag(params: {
    accountId: string;
    id: string;
    options: { category?: Category; label?: string; isPublic: boolean };
  }) {
    if (params.options.isPublic) {
      throw new ManagerError(
        "public_tag_forbidden",
        "Normal users cannot publish tags.",
        403,
      );
    }
    if (params.options.label !== undefined) {
      validateText(params.options.label, "Tag label");
    }

    const { data, error } = await this.supabase
      .from("technique_tags")
      .update({
        ...(params.options.category && { category: params.options.category }),
        ...(params.options.label !== undefined && {
          label: params.options.label.trim(),
        }),
      })
      .eq("key", params.id)
      .eq("is_public", false)
      .eq("generated_by_account_id", params.accountId)
      .select("*")
      .single();

    if (error || !data) {
      throw new ManagerError("tag_not_found", "Technique tag not found.", 404);
    }
    return toTechniqueTag(data);
  }

  async deleteTags(params: { id: string[]; accountId: string }) {
    if (!params.id.length) return { deleted: true as const };
    const { data: owned } = await this.supabase
      .from("technique_tags")
      .select("key")
      .in("key", params.id)
      .eq("is_public", false)
      .eq("generated_by_account_id", params.accountId);
    if (owned?.length !== new Set(params.id).size) {
      throw new ManagerError("tag_not_found", "Technique tag not found.", 404);
    }
    const { error } = await this.supabase
      .from("technique_tags")
      .delete()
      .in("key", params.id)
      .eq("is_public", false)
      .eq("generated_by_account_id", params.accountId);
    if (error) {
      throw new ManagerError("tag_delete_failed", error.message, 500);
    }
    return { deleted: true as const };
  }

  async mergeTags(params: { masterId: string; ids: string[] }) {
    const { data: master, error } = await this.supabase
      .from("technique_tags")
      .select("*")
      .eq("key", params.masterId)
      .single();
    if (error || !master) {
      throw new ManagerError("tag_not_found", "Master tag not found.", 404);
    }

    const mergeIds = [...new Set(params.ids)].filter(
      (id) => id !== params.masterId,
    );
    if (mergeIds.length) {
      const { error: deleteError } = await this.supabase
        .from("technique_tags")
        .delete()
        .in("key", mergeIds)
        .eq("is_public", false);
      if (deleteError) {
        throw new ManagerError("tag_merge_failed", deleteError.message, 500);
      }
    }
    return toTechniqueTag(master);
  }

  private async getJournalRow(
    id: string,
    accountId?: string,
  ): Promise<JournalRow> {
    let query = this.supabase.from("journal_entries").select("*").eq("id", id);
    if (accountId) query = query.eq("account_id", accountId);
    const { data, error } = await query.single();
    if (error || !data) {
      throw new ManagerError(
        "journal_entry_not_found",
        "Journal entry not found.",
        404,
      );
    }
    return data;
  }

  private async withPartner(row: JournalRow) {
    if (!row.training_partner_id) return toJournalEntry(row);
    const { data } = await this.supabase
      .from("training_partners")
      .select("*")
      .eq("id", row.training_partner_id)
      .maybeSingle();
    if (!data?.partner_account_id) return toJournalEntry(row, data);

    const partnerProfiles = await this.getPartnerProfiles(row.account_id, [
      data.id,
    ]);
    return withPartnerProfile(
      toJournalEntry(row, data, partnerProfiles.get(data.id)?.profilePhoto),
      partnerProfiles.get(data.id),
    );
  }

  private async withPartners(rows: JournalRow[]) {
    const partnerIds = [
      ...new Set(
        rows
          .map((row) => row.training_partner_id)
          .filter((id): id is string => Boolean(id)),
      ),
    ];
    if (!partnerIds.length) return rows.map((row) => toJournalEntry(row));

    const { data, error } = await this.supabase
      .from("training_partners")
      .select("*")
      .in("id", partnerIds);
    if (error) {
      throw new ManagerError("training_partners_failed", error.message, 500);
    }

    const partners = new Map(
      (data ?? []).map((partner) => [partner.id, partner]),
    );
    const accountBackedPartnerIds = (data ?? [])
      .filter((partner) => Boolean(partner.partner_account_id))
      .map((partner) => partner.id);
    const partnerProfiles = await this.getPartnerProfiles(
      rows[0]?.account_id,
      accountBackedPartnerIds,
    );
    const visiblePartnerBelts = await this.getVisiblePartnerBelts(
      rows[0]?.account_id,
      rows.map((row) => row.id),
    );

    return rows.map((row) => {
      const partner = row.training_partner_id
        ? partners.get(row.training_partner_id)
        : undefined;
      const entry = toJournalEntry(
        row,
        partner,
        partner ? partnerProfiles.get(partner.id)?.profilePhoto : undefined,
      );
      const entryWithProfile = partner
        ? withPartnerProfile(entry, partnerProfiles.get(partner.id))
        : entry;
      const visibleBelt = visiblePartnerBelts.get(row.id);
      if (entryWithProfile.trainingPartner && visibleBelt) {
        return {
          ...entryWithProfile,
          trainingPartner: {
            ...entryWithProfile.trainingPartner,
            belt: visibleBelt,
          },
        };
      }
      if (
        !entryWithProfile.trainingPartner &&
        row.training_partner_id &&
        visibleBelt
      ) {
        return {
          ...entryWithProfile,
          trainingPartner: {
            id: row.training_partner_id,
            belt: visibleBelt,
          },
        };
      }
      return entryWithProfile;
    });
  }

  private async getVisiblePartnerBelts(
    accountId: string | undefined,
    journalEntryIds: string[],
  ) {
    const belts = new Map<string, Belt | null>();
    if (!accountId || !journalEntryIds.length) return belts;

    const { data, error } = await this.supabase.rpc(
      "get_visible_journal_entry_partner_belts",
      {
        target_account_id: accountId,
        journal_entry_ids: journalEntryIds,
      },
    );
    if (error) {
      if (
        error.code === "PGRST202" ||
        error.message.includes("get_visible_journal_entry_partner_belts")
      ) {
        return belts;
      }
      throw new ManagerError(
        "training_partner_belts_failed",
        error.message,
        500,
      );
    }
    for (const partner of data ?? []) {
      belts.set(partner.journal_entry_id, partner.belt);
    }
    return belts;
  }

  private async getPartnerProfiles(
    accountId: string | undefined,
    partnerIds: string[],
  ) {
    const partnerProfiles = new Map<string, PartnerProfile>();
    if (!accountId || !partnerIds.length) return partnerProfiles;

    const { data: profiles, error: profileError } = await this.supabase.rpc(
      "get_training_partner_profiles",
      {
        account_id: accountId,
        training_partner_ids: partnerIds,
      },
    );
    if (!profileError) {
      for (const partner of profiles ?? []) {
        partnerProfiles.set(partner.id, {
          firstName: partner.first_name ?? undefined,
          lastName: partner.last_name ?? undefined,
          profilePhoto: partner.profile_photo ?? undefined,
          belt: partner.belt ?? undefined,
          weight: partner.weight ?? undefined,
        });
      }
      return partnerProfiles;
    }
    if (
      profileError.code !== "PGRST202" &&
      !profileError.message.includes("get_training_partner_profiles")
    ) {
      throw new ManagerError(
        "training_partner_profiles_failed",
        profileError.message,
        500,
      );
    }

    const { data, error } = await this.supabase.rpc(
      "get_training_partner_profile_photos",
      {
        account_id: accountId,
        training_partner_ids: partnerIds,
      },
    );
    if (error) {
      throw new ManagerError(
        "training_partner_profiles_failed",
        error.message,
        500,
      );
    }
    for (const partner of data ?? []) {
      partnerProfiles.set(partner.id, {
        profilePhoto: partner.profile_photo ?? undefined,
      });
    }
    return partnerProfiles;
  }

  private async createCustomPartner(
    accountId: string,
    input: PartnerInput,
  ): Promise<string> {
    const { data, error } = await this.supabase
      .from("training_partners")
      .insert({
        owner_account_id: accountId,
        first_name: cleanText(input.partnerFirstName),
        last_name: cleanText(input.partnerLastName),
        partner_weight: input.partnerWeight ?? null,
        partner_age: input.partnerAge ?? null,
        partner_belt: input.partnerBelt ?? null,
      })
      .select("id")
      .single();
    if (error || !data) {
      throw new ManagerError(
        "custom_partner_creation_failed",
        error?.message ?? "Could not create custom partner.",
        500,
      );
    }
    return data.id;
  }

  private async assertOwnedPartner(accountId: string, partnerId: string) {
    const { data, error } = await this.supabase
      .from("training_partners")
      .select("id")
      .eq("id", partnerId)
      .eq("owner_account_id", accountId)
      .single();
    if (error || !data) {
      throw new ManagerError(
        "training_partner_not_found",
        "Training partner not found.",
        422,
      );
    }
  }
}

function validatePartnerMode(input: PartnerInput) {
  if (input.trainingPartnerId && hasCustomPartner(input)) {
    throw new ManagerError(
      "partner_mode_conflict",
      "Choose either a saved training partner or custom partner details.",
      422,
    );
  }
}

function hasCustomPartner(input: PartnerInput) {
  return Boolean(
    input.partnerFirstName?.trim() ||
    input.partnerLastName?.trim() ||
    input.partnerWeight ||
    input.partnerAge ||
    input.partnerBelt,
  );
}

function validateText(value: string, label: string) {
  if (!value.trim()) {
    throw new ManagerError("invalid_text", `${label} is required.`, 422);
  }
}

function validateDate(value: Date, label: string) {
  if (Number.isNaN(value.getTime())) {
    throw new ManagerError("invalid_date", `${label} is invalid.`, 422);
  }
  if (
    value.toISOString().slice(0, 10) > new Date().toISOString().slice(0, 10)
  ) {
    throw new ManagerError(
      "future_date_not_allowed",
      `${label} cannot be in the future.`,
      422,
    );
  }
}

function cleanText(value?: string | null) {
  return value?.trim() || null;
}

function escapeLike(value: string) {
  return value.replaceAll("%", "\\%").replaceAll("_", "\\_");
}

function sortColumn(field: JournalEntrySort["field"]) {
  const columns = {
    trainedAt: "trained_date",
    category: "category",
    name: "name",
    journalType: "journal_type",
  } as const;
  return columns[field as keyof typeof columns];
}

function withPartnerProfile(
  entry: JournalEntryDetail,
  profile: PartnerProfile | undefined,
) {
  if (!entry.trainingPartner || !profile) return entry;

  return {
    ...entry,
    trainingPartner: {
      ...entry.trainingPartner,
      firstName: profile.firstName ?? entry.trainingPartner.firstName,
      lastName: profile.lastName ?? entry.trainingPartner.lastName,
      profilePhoto: profile.profilePhoto ?? entry.trainingPartner.profilePhoto,
      belt: profile.belt ?? entry.trainingPartner.belt,
      weight: profile.weight ?? entry.trainingPartner.weight,
    },
  };
}

function createTagKey(label: string) {
  const slug = label
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${slug || "tag"}-${crypto.randomUUID().slice(0, 8)}`;
}

function normalizeTagLabel(label: string) {
  return label.trim().toLocaleLowerCase();
}

function fuzzyScore(label: string, search: string) {
  const left = label.toLowerCase();
  const right = search.toLowerCase();
  if (left.includes(right)) return left.indexOf(right);
  const distance = levenshtein(left, right);
  return distance <= Math.max(2, Math.floor(right.length / 3))
    ? distance + 100
    : Number.POSITIVE_INFINITY;
}

function levenshtein(left: string, right: string) {
  const previous = Array.from(
    { length: right.length + 1 },
    (_, index) => index,
  );
  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    let diagonal = previous[0];
    previous[0] = leftIndex;
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const above = previous[rightIndex];
      previous[rightIndex] = Math.min(
        previous[rightIndex] + 1,
        previous[rightIndex - 1] + 1,
        diagonal + (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1),
      );
      diagonal = above;
    }
  }
  return previous[right.length];
}

function compareTags(
  left: Database["public"]["Tables"]["technique_tags"]["Row"],
  right: Database["public"]["Tables"]["technique_tags"]["Row"],
  field: "label" | "category" | "createdAt",
) {
  if (field === "createdAt") {
    return left.created_date.localeCompare(right.created_date);
  }
  return left[field].localeCompare(right[field]);
}
