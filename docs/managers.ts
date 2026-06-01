import {
  AgeClass,
  AuthProvider,
  Belt,
  Intensity,
  NotificationCategory,
  Category,
  WeightClass,
} from "./data-model";

export type AccountDetail = {
  id: string;
  object: "account";
  firstName?: string;
  lastName?: string;
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

export type FriendRelationshipStatus =
  | "none"
  | "pending-inbound"
  | "pending-outbound"
  | "accepted"
  | "blocked"
  | "removed";

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
    profilePhoto?: string;
    belt?: Belt;
    weight?: WeightClass;
    birthday?: Date;
  }) => Promise<AccountDetail>;
  sendFriendRequest: (params: { id: string }) => Promise<{ sent: true }>;
  acceptFriendRequest: (params: { id: string }) => Promise<{ accepted: true }>;
  removeFriend: (params: { id: string }) => Promise<{ removed: true }>;
  getFriendRelationshipStatus: (params: {
    id: string;
  }) => Promise<{ status: FriendRelationshipStatus }>;
  getFriends: (params: {
    id: string;
    limit: number;
    offset: number;
  }) => Promise<{
    items: AccountDetail[];
  }>;
  getPotentialFriends: (params: {
    id: string;
    limit: number;
    offset: number;
  }) => Promise<{
    items: AccountDetail[];
  }>;
}

export type JournalEntryDetail = {
  id: string;
  object: "journal_entry";
  accountId: string;
  name: string;
  category: Category;
  setup: string;
  isAttempt: boolean;
  isSuccessful?: boolean;
  notes?: string;
  intensity?: Intensity;
  isNoGi?: boolean;
  trainingPartner?: {
    accountId?: string;
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
  isSuccessful?: boolean;
  isNoGi?: boolean;
};

export type JournalEntrySort = {
  field: "trainedAt" | "category" | "name" | "isSuccessful" | "trainingPartner";
  direction: "asc" | "desc";
};

export interface IJournalEntryManager {
  createJournalEntry: (params: {
    accountId: string;
    name: string;
    category: Category;
    setup: string;
    isAttempt: boolean;
    isSuccessful?: boolean;
    notes?: string;
    intensity?: Intensity;
    isNoGi?: boolean;
    trainingPartnerAccountId?: string;
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
      isAttempt?: boolean;
      isSuccessful?: boolean;
      notes?: string;
      intensity?: Intensity;
      isNoGi?: boolean;
      trainingPartnerAccountId?: string;
      partnerWeight?: WeightClass;
      partnerAge?: AgeClass;
      partnerBelt?: Belt;
      trainedDate?: Date;
    };
  }) => Promise<JournalEntryDetail>;
  // Manager invariants:
  // - If category is "tap", isSuccessful is always cleared.
  // - trainedDate defaults to createdDate when omitted.
  // - Partner inputs are mutually exclusive: friend partner, custom partner, or no partner.
  getJournalEntry: (params: { id: string }) => Promise<JournalEntryDetail>;
  getJournalEntries: (params: {
    filter: JournalEntryFilters;
    sort?: JournalEntrySort; // default: trainedAt desc
    limit: number;
    offset: number;
  }) => Promise<{ items: JournalEntryDetail[]; limit: number; offset: number }>;
  deleteJournalEntries: (params: {
    id: string[];
  }) => Promise<{ deleted: true }>;
  assignFriendToJournalEntry: (params: {
    accountId: string;
    journalEntryId: string;
  }) => Promise<JournalEntryDetail>; // Use NotificationManager.sendJournalEntryAssignment notification to friend
  createTag: (params: {
    category: Category;
    generatedBy: string;
    label: string;
    isPublic?: boolean; // defaults to false for user-created tags
  }) => Promise<TechniqueTagDetail>;
  getTags: (params: {
    filter: {
      search?: string;
      accountId?: string; // returns public tags plus this account's own tags
    };
    sort?: {
      field: "label" | "category" | "createdAt";
      direction: "asc" | "desc";
    };
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
