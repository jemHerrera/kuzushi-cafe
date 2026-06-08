import {
  AgeClass,
  AuthProvider,
  Belt,
  Intensity,
  JournalType,
  NotificationCategory,
  Category,
  AccountPrivacySettings,
  PrivacyType,
  WeightClass,
} from "./data-model";

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
  birthday: number;
  createdAt: number;
  updatedAt: number;
};

export type SignInParams =
  | {
      provider: "google";
      redirectTo: string;
    }
  | {
      provider: "magic-link";
      email: string;
      redirectTo: string;
    };

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

export type AuthSessionDetail = {
  object: "auth_session";
  account: AccountDetail;
  isNewAccount: boolean;
  isProfileComplete: boolean;
};

export type PublicAccountSummary = {
  id: string;
  object: "public_account_summary";
  firstName?: string;
  lastName?: string;
  bio?: string;
  profilePhoto?: string;
  belt?: Belt;
  relationshipStatus?: TrainingPartnerRelationshipStatus;
};

export type TrainingPartnerRelationshipStatus =
  | "none"
  | "pending-inbound"
  | "pending-outbound"
  | "accepted"
  | "blocked"
  | "removed";

export type TrainingPartnerRequestDirection = "inbound" | "outbound";

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

export interface IAuthManager {
  signIn: (params: SignInParams) => Promise<SignInResult>;
  getCurrentSession: () => Promise<AuthSessionDetail | null>;
  signOut: () => Promise<{ signedOut: true }>;
}

export interface IAccountManager {
  createAccount: (params: {
    authUserId: string;
    email: string;
    authProvider: AuthProvider;
  }) => Promise<AccountDetail>;
  getAccount: (params: { id: string }) => Promise<AccountDetail>;
  updateAccount: (params: {
    firstName?: string;
    lastName?: string;
    bio?: string;
    profilePhoto?: string;
    belt?: Belt;
    weight?: WeightClass;
    birthday?: Date;
  }) => Promise<AccountDetail>;
  getPrivacySettings: (params: {
    accountId: string;
  }) => Promise<AccountPrivacySettings>;
  updatePrivacySettings: (params: {
    accountId: string;
    options: {
      profile?: PrivacyType;
      journalEntries?: PrivacyType;
      submissions?: PrivacyType;
      sweeps?: PrivacyType;
      reversals?: PrivacyType;
      backtakes?: PrivacyType;
      guardPasses?: PrivacyType;
      taps?: PrivacyType;
    };
  }) => Promise<AccountPrivacySettings>;
  searchPublicProfiles: (params: {
    viewerAccountId?: string;
    search?: string;
    limit: number;
    offset: number;
  }) => Promise<{
    items: PublicAccountSummary[];
    limit: number;
    offset: number;
  }>;
  sendTrainingPartnerRequest: (params: {
    fromAccountId: string;
    toAccountId: string;
  }) => Promise<{ sent: true }>;
  acceptTrainingPartnerRequest: (params: {
    accountId: string;
    requesterAccountId: string;
  }) => Promise<{ accepted: true }>;
  cancelTrainingPartnerRequest: (params: {
    fromAccountId: string;
    toAccountId: string;
  }) => Promise<{ canceled: true }>;
  removeTrainingPartner: (params: {
    accountId: string;
    trainingPartnerId: string;
  }) => Promise<{ removed: true }>;
  blockAccount: (params: {
    accountId: string;
    blockedAccountId: string;
  }) => Promise<{ blocked: true }>;
  unblockAccount: (params: {
    accountId: string;
    blockedAccountId: string;
  }) => Promise<{ unblocked: true }>;
  getTrainingPartnerRelationshipStatus: (params: {
    accountId: string;
    otherAccountId: string;
  }) => Promise<{ status: TrainingPartnerRelationshipStatus }>;
  getTrainingPartnerRequests: (params: {
    accountId: string;
    direction: TrainingPartnerRequestDirection;
    limit: number;
    offset: number;
  }) => Promise<{
    items: AccountDetail[];
    limit: number;
    offset: number;
  }>;
  getTrainingPartners: (params: {
    accountId: string;
    search?: string;
    limit: number;
    offset: number;
  }) => Promise<{
    items: TrainingPartnerDetail[];
    limit: number;
    offset: number;
  }>;
  searchTrainingPartners: (params: {
    accountId: string;
    search: string;
    limit: number;
    offset: number;
  }) => Promise<{
    items: TrainingPartnerDetail[];
    limit: number;
    offset: number;
  }>;
  createCustomTrainingPartner: (params: {
    accountId: string;
    firstName?: string;
    lastName?: string;
    partnerWeight?: WeightClass;
    partnerAge?: AgeClass;
    partnerBelt?: Belt;
  }) => Promise<TrainingPartnerDetail>;
  getPotentialTrainingPartners: (params: {
    accountId: string;
    search?: string;
    limit: number;
    offset: number;
  }) => Promise<{
    items: PublicAccountSummary[];
    limit: number;
    offset: number;
  }>;
  searchPotentialTrainingPartners: (params: {
    accountId: string;
    search: string;
    limit: number;
    offset: number;
  }) => Promise<{
    items: PublicAccountSummary[];
    limit: number;
    offset: number;
  }>;
}

export type JournalEntryDetail = {
  id: string;
  object: "journal_entry";
  accountId: string;
  name: string;
  category: Category;
  setup: string;
  journalType?: JournalType;
  notes?: string;
  intensity?: Intensity;
  isNoGi?: boolean;
  trainingPartner?: {
    id: string;
    accountId?: string;
    firstName?: string;
    lastName?: string;
    weight?: WeightClass;
    age?: AgeClass;
    belt?: Belt;
  };
  trainedAt: number;
  createdAt: number;
  updatedAt: number;
};

export type TechniqueTagDetail = {
  id: string;
  object: "technique_tag";
  label: string;
  category: Category;
  generatedBy?: string; // accountId
  isPublic: boolean;
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

export interface IJournalEntryManager {
  createJournalEntry: (params: {
    accountId: string;
    name: string;
    category: Category;
    setup: string;
    journalType?: JournalType;
    notes?: string;
    intensity?: Intensity;
    isNoGi?: boolean;
    trainingPartnerId?: string;
    partnerFirstName?: string;
    partnerLastName?: string;
    partnerWeight?: WeightClass;
    partnerAge?: AgeClass;
    partnerBelt?: Belt;
    trainedDate?: Date;
  }) => Promise<JournalEntryDetail>; // In endpoint level, may create tag as well
  updateJournalEntry: (params: {
    id: string;
    options: {
      name?: string;
      category?: Category;
      setup?: string;
      journalType?: JournalType;
      notes?: string;
      intensity?: Intensity;
      isNoGi?: boolean;
      trainingPartnerId?: string;
      partnerFirstName?: string;
      partnerLastName?: string;
      partnerWeight?: WeightClass;
      partnerAge?: AgeClass;
      partnerBelt?: Belt;
      trainedDate?: Date;
    };
  }) => Promise<JournalEntryDetail>;
  // Manager invariants:
  // - If category is "tap", journalType is always cleared.
  // - trainedDate defaults to createdDate when omitted.
  // - Partner inputs are mutually exclusive: training partner, custom partner, or no partner.
  // - Account-backed training partner assignments must reference an accepted TrainingPartner row owned by the entry owner.
  // - Removing an account-backed training partner clears partner on both reciprocal TrainingPartner rows instead of deleting them.
  // - Removed rows snapshot the former partner's firstName, lastName, age, weight, and belt for historical journal display.
  getJournalEntry: (params: { id: string }) => Promise<JournalEntryDetail>;
  getJournalEntries: (params: {
    accountId: string;
    filter: JournalEntryFilters;
    sort?: JournalEntrySort; // default: trainedAt desc
    limit: number;
    offset: number;
  }) => Promise<{ items: JournalEntryDetail[]; limit: number; offset: number }>;
  searchJournalEntries: (params: {
    accountId: string;
    search: string;
    filter?: Omit<JournalEntryFilters, "search">;
    sort?: JournalEntrySort;
    limit: number;
    offset: number;
  }) => Promise<{ items: JournalEntryDetail[]; limit: number; offset: number }>;
  deleteJournalEntries: (params: {
    id: string[];
  }) => Promise<{ deleted: true }>;
  assignTrainingPartnerToJournalEntry: (params: {
    accountId: string;
    trainingPartnerId: string;
    journalEntryId: string;
  }) => Promise<JournalEntryDetail>; // Use NotificationManager.sendJournalEntryAssignment notification to the account-backed training partner
  createTag: (params: {
    category: Category;
    generatedBy: string;
    label: string;
    isPublic?: boolean; // defaults to false for user-created tags
  }) => Promise<TechniqueTagDetail>;
  getTags: (params: {
    filter: {
      search?: string;
      category?: Category;
      accountId?: string; // returns public tags plus this account's own tags
    };
    sort?: {
      field: "label" | "category" | "createdAt";
      direction: "asc" | "desc";
    };
    limit: number;
    offset: number;
  }) => Promise<{ items: TechniqueTagDetail[]; limit: number; offset: number }>;
  searchSavedTechniqueTags: (params: {
    accountId: string;
    search: string;
    category?: Category;
    limit: number;
    offset: number;
  }) => Promise<{ items: TechniqueTagDetail[]; limit: number; offset: number }>;
  updateTag: (params: {
    id: string;
    options: {
      category?: Category;
      label?: string;
      isPublic: boolean;
    };
  }) => Promise<TechniqueTagDetail>;
  deleteTags: (params: { id: string[] }) => Promise<{ deleted: true }>;
  mergeTags: (params: {
    masterId: string;
    ids: string[];
  }) => Promise<TechniqueTagDetail>;
}

export type AggregateTimeline = "week" | "month" | "year" | "custom";

export type AggregateStatsDetail = {
  object: "aggregate_stats";
  accountId: string;
  category?: Category;
  timeline: AggregateTimeline;
  startAt: number;
  endAt: number;
  journalTypes: JournalType[];
  attempts: number;
  successes: number;
  series: {
    label: string;
    attempts: number;
    successes: number;
  }[];
  stats: {
    label: string;
    count: number;
    percentage: number;
  }[];
};

export interface IAggregateManager {
  getAggregateStats: (params: {
    accountId: string;
    category?: Category;
    timeline: AggregateTimeline;
    startDate?: Date;
    endDate?: Date;
    journalTypes?: JournalType[];
  }) => Promise<AggregateStatsDetail>;
  getCategoryBreakdown: (params: {
    accountId: string;
    timeline: AggregateTimeline;
    startDate?: Date;
    endDate?: Date;
    journalTypes?: JournalType[];
  }) => Promise<{
    object: "category_breakdown";
    accountId: string;
    timeline: AggregateTimeline;
    startAt: number;
    endAt: number;
    journalTypes: JournalType[];
    items: {
      category: Category;
      attempts: number;
      successes: number;
      percentage: number;
    }[];
  }>;
}

export type NotificationDetail = {
  id: string;
  object: "notification";
  heading: string;
  text: string;
  category: NotificationCategory;
  isRead: boolean;
  accountId: string;
  updatedAt: number;
};

export interface INotificationManager {
  sendJournalEntryAssignmentNotification: (params: {
    accountId: string;
    journalEntryId: string;
  }) => Promise<NotificationDetail>;
  getNotifications: (params: {
    accountId: string;
    limit: number;
    offset: number;
  }) => Promise<{ items: NotificationDetail[]; limit: number; offset: number }>;
  markNotificationAsRead: (params: {
    id: string;
  }) => Promise<NotificationDetail>;
  markAllNotificationsAsRead: (params: {
    accountId: string;
  }) => Promise<{ updated: true }>;
}

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

export interface IDonationManager {
  createCheckoutSession: (params: {
    accountId: string;
    amount: number;
    currency?: "usd";
    successUrl: string;
    cancelUrl: string;
  }) => Promise<DonationCheckoutSessionDetail>;
  getCheckoutStatus: (params: {
    accountId: string;
    sessionId: string;
  }) => Promise<{
    status: DonationCheckoutStatus;
  }>;
}
