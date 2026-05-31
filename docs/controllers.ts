import {
  AgeClass,
  Belt,
  Intensity,
  NotificationCategory,
  TechniqueCategory,
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

export type TechniqueDetail = {
  id: string;
  object: "technique";
  accountId: string;
  name: string;
  category: TechniqueCategory;
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
  category: TechniqueCategory;
  generatedBy?: string; // accountId
  isPublic: boolean;
  createdAt: number;
  updatedAt: number;
};

export interface ITechniqueManager {
  createTechnique: (params: {}) => Promise<TechniqueDetail>; // TODO. In endpoint level, may create tag as well
  updateTechnique: (params: {}) => Promise<TechniqueDetail>; // TODO
  getTechnique: (params: { id: string }) => Promise<TechniqueDetail>;
  getTechniques: (params: {
    filter: {};
    sort?: {};
    limit: number;
    offset: number;
  }) => Promise<{ items: TechniqueDetail[]; limit: number; offset: number }>;
  deleteTechniques: (params: { id: string[] }) => Promise<{ deleted: true }>;
  assignFriendToTechnique: (params: {
    accountId: string;
    techniqueId: string;
  }) => Promise<TechniqueDetail>; // Use NotificationManager.sendFriendAssignment notification to friend
  createTag: (params: {
    category: string;
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
      category?: string;
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
  sendTechniqueAssignmentNotification: (params: {
    accountId: string;
    techniqueId: string;
  }) => Promise<NotificationDetail>;
}
