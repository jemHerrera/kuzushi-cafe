import {
  AgeClass,
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

// Managers only handlee database procedures. Does not handle auth.

export interface IAccountManager {
  createAccount: (params: {
    email?: string;
    googleAuthorizationCode?: string;
  }) => Promise<AccountDetail>;
  signIn: (params: {}) => Promise<unknown>; // TODO
  getAccount: (params: { id: string }) => Promise<AccountDetail>;
  updateAccount: (params: { firstName?: string }) => Promise<AccountDetail>;
  sendFriendRequest: (params: { id: string }) => Promise<unknown>; // TODO
  acceptFriendRequest: (params: { id: string }) => Promise<unknown>; // TODO
  getFriends: (params: {
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
  isSuccessful: boolean;
  notes?: string;
  intensity: Intensity;
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

export interface IJournalEntryManager {
  createJournalEntry: (params: {}) => Promise<JournalEntryDetail>; // TODO. In endpoint level, may create tag as well
  updateJournalEntry: (params: {}) => Promise<JournalEntryDetail>; // TODO
  getJournalEntry: (params: { id: string }) => Promise<JournalEntryDetail>;
  getJournalEntries: (params: {
    filter: {};
    sort?: {};
    limit: number;
    offset: number;
  }) => Promise<{ items: JournalEntryDetail[]; limit: number; offset: number }>;
  deleteJournalEntries: (params: { id: string[] }) => Promise<{ deleted: true }>;
  assignFriendToJournalEntry: (params: {
    accountId: string;
    journalEntryId: string;
  }) => Promise<JournalEntryDetail>; // Use NotificationManager.sendJournalEntryAssignment notification to friend
  createTag: (params: {
    category: Category;
    generatedBy: string;
    label: string;
    isPublic: boolean;
  }) => Promise<TechniqueTagDetail>;
  getTags: (params: {
    filter: {};
    sort?: {};
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
}
