import type { Database } from "@/lib/supabase/database.types";

export type AgeClass = Database["public"]["Enums"]["age_class"];
export type AuthProvider = Database["public"]["Enums"]["auth_provider"];
export type Belt = Database["public"]["Enums"]["belt"];
export type Category = Database["public"]["Enums"]["category"];
export type Intensity = Database["public"]["Enums"]["intensity"];
export type JournalType = Database["public"]["Enums"]["journal_type"];
export type NotificationCategory =
  Database["public"]["Enums"]["notification_category"];
export type PrivacyType = Database["public"]["Enums"]["privacy_type"];
export type WeightClass = Database["public"]["Enums"]["weight_class"];

export type AccountDetail = {
  id: string;
  object: "account";
  firstName?: string;
  lastName?: string;
  bio?: string;
  email: string;
  profilePhoto?: string;
  belt: Belt;
  weight: WeightClass;
  birthday?: number;
  donated: boolean;
  createdAt: number;
  updatedAt: number;
};

export type AuthSessionDetail = {
  object: "auth_session";
  account: AccountDetail;
  isNewAccount: boolean;
  isProfileComplete: boolean;
};

export type SignInParams =
  | { provider: "google"; redirectTo: string }
  | { provider: "magic-link"; email: string; redirectTo: string };

export type SignInResult =
  | {
      object: "sign_in_result";
      provider: "google";
      status: "redirect_required";
      redirectUrl: string;
    }
  | {
      object: "sign_in_result";
      provider: "magic-link";
      status: "magic_link_sent";
      email: string;
    };

export type AccountPrivacySettings = {
  accountId: string;
  journalEntries: PrivacyType;
  activity: PrivacyType;
  stats: PrivacyType;
  createdAt: number;
  updatedAt: number;
};

export type TrainingPartnerRelationshipStatus =
  | "none"
  | "pending-inbound"
  | "pending-outbound"
  | "accepted"
  | "blocked"
  | "removed";

export type PublicAccountSummary = {
  id: string;
  object: "public_account_summary";
  firstName?: string;
  lastName?: string;
  bio?: string;
  profilePhoto?: string;
  belt?: Belt;
  donated?: boolean;
  relationshipStatus?: TrainingPartnerRelationshipStatus;
};

export type PublicProfileDetail = PublicAccountSummary & {
  visibility: {
    journalEntries: boolean;
    activity: boolean;
    stats: boolean;
  };
};

export type TrainingPartnerDetail =
  | {
      id: string;
      object: "training_partner";
      accountId: string;
      firstName?: string;
      lastName?: string;
      profilePhoto?: string;
      belt: Belt;
      weight: WeightClass;
      createdAt: number;
      updatedAt: number;
    }
  | {
      id: string;
      object: "custom_training_partner";
      firstName?: string;
      lastName?: string;
      weight?: WeightClass;
      age?: AgeClass;
      belt?: Belt;
      createdAt: number;
      updatedAt: number;
    };

export type JournalEntryDetail = {
  id: string;
  object: "journal_entry";
  accountId: string;
  name: string;
  category: Category;
  setup?: string;
  journalType?: JournalType;
  notes?: string;
  intensity?: Intensity;
  isNoGi?: boolean;
  trainingPartner?: {
    id: string;
    accountId?: string;
    firstName?: string;
    lastName?: string;
    profilePhoto?: string;
    weight?: WeightClass;
    age?: AgeClass;
    belt?: Belt;
  };
  trainedAt?: number;
  createdAt: number;
  updatedAt: number;
};

export type JournalEntryFilters = {
  search?: string;
  category?: Category[];
  journalTypes?: JournalType[];
  isNoGi?: boolean;
};

export type JournalEntrySort = {
  field: "trainedAt" | "category" | "name" | "journalType" | "trainingPartner";
  direction: "asc" | "desc";
};

export type TechniqueTagDetail = {
  id: string;
  object: "technique_tag";
  label: string;
  category: Category;
  generatedBy?: string;
  isPublic: boolean;
  createdAt: number;
  updatedAt: number;
};

export type TrainingActivityDetail = {
  object: "training_activity";
  accountId: string;
  startDate: string;
  endDate: string;
  totalEntries: number;
  activeDays: number;
  days: {
    date: string;
    count: number;
  }[];
};

export type StatsTimeline = "week" | "month" | "year" | "all";
export type StatsTypeFilter = "all" | "success";

export type StatsDetail = {
  object: "stats";
  accountId: string;
  category: Category;
  timeline: StatsTimeline;
  type: StatsTypeFilter;
  startDate?: string;
  endDate: string;
  items: {
    label: string;
    attempts: number;
    successes: number;
    occurrences: number;
  }[];
};

export type NotificationDetail = {
  id: string;
  object: "notification";
  heading: string;
  text: string;
  category: NotificationCategory;
  isRead: boolean;
  accountId: string;
  sourceAccountId?: string;
  updatedAt: number;
};

export type NotificationIndicators = {
  hasUnreadNotifications: boolean;
  hasInboundTrainingPartnerRequests: boolean;
};

export type DonationCheckoutStatus =
  | "success"
  | "canceled"
  | "retryable-failure";

export type DonationCheckoutSessionDetail = {
  object: "donation_checkout_session";
  id: string;
  accountId: string;
  amount: number;
  currency: "usd";
  checkoutUrl: string;
  status: DonationCheckoutStatus;
  createdAt: number;
  updatedAt: number;
};

export type PaginatedResponse<T> = {
  items: T[];
  limit: number;
  offset: number;
};

export type PublicJournalEntriesResponse =
  PaginatedResponse<JournalEntryDetail> & {
    visibility: PrivacyType;
  };

export type PublicTrainingActivityResponse = TrainingActivityDetail & {
  visibility: PrivacyType;
};

export type ApiErrorDetail = {
  error: {
    code: string;
    message: string;
    issues?: Array<{ path: string; message: string }>;
  };
};
