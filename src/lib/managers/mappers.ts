import type { Database } from "@/lib/supabase/database.types";
import type {
  AccountPrivacySettings,
  JournalEntryDetail,
  NotificationDetail,
  TechniqueTagDetail,
} from "@/lib/managers/types";

type PrivacyRow =
  Database["public"]["Tables"]["account_privacy_settings"]["Row"];
type JournalRow = Database["public"]["Tables"]["journal_entries"]["Row"];
type PartnerRow = Database["public"]["Tables"]["training_partners"]["Row"];
type NotificationRow = Database["public"]["Tables"]["notifications"]["Row"];
type TagRow = Database["public"]["Tables"]["technique_tags"]["Row"];

export function toPrivacySettings(row: PrivacyRow): AccountPrivacySettings {
  return {
    accountId: row.account_id,
    profile: row.profile,
    journalEntries: row.journal_entries,
    submissions: row.submissions,
    sweeps: row.sweeps,
    reversals: row.reversals,
    backtakes: row.backtakes,
    guardPasses: row.guard_passes,
    taps: row.taps,
    createdAt: new Date(row.created_date).getTime(),
    updatedAt: new Date(row.updated_date).getTime(),
  };
}

export function toJournalEntry(
  row: JournalRow,
  partner?: PartnerRow | null,
): JournalEntryDetail {
  return {
    id: row.id,
    object: "journal_entry",
    accountId: row.account_id,
    name: row.name,
    category: row.category,
    setup: row.setup,
    journalType: row.journal_type ?? undefined,
    notes: row.notes ?? undefined,
    intensity: row.intensity ?? undefined,
    isNoGi: row.is_no_gi ?? undefined,
    trainingPartner: partner
      ? {
          id: partner.id,
          accountId:
            partner.partner_account_id ??
            partner.former_partner_account_id ??
            undefined,
          firstName: partner.first_name ?? undefined,
          lastName: partner.last_name ?? undefined,
          weight: partner.partner_weight ?? undefined,
          age: partner.partner_age ?? undefined,
          belt: partner.partner_belt ?? undefined,
        }
      : undefined,
    trainedAt: new Date(row.trained_date).getTime(),
    createdAt: new Date(row.created_date).getTime(),
    updatedAt: new Date(row.updated_date).getTime(),
  };
}

export function toTechniqueTag(row: TagRow): TechniqueTagDetail {
  return {
    id: row.key,
    object: "technique_tag",
    label: row.label,
    category: row.category,
    generatedBy: row.generated_by_account_id ?? undefined,
    isPublic: row.is_public,
    createdAt: new Date(row.created_date).getTime(),
    updatedAt: new Date(row.updated_date).getTime(),
  };
}

export function toNotification(row: NotificationRow): NotificationDetail {
  return {
    id: row.id,
    object: "notification",
    heading: row.heading,
    text: row.text,
    category: row.category,
    isRead: row.is_read,
    accountId: row.account_id,
    updatedAt: new Date(row.updated_date).getTime(),
  };
}
