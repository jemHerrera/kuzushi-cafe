export type Belt =
  | "unknown"
  | "white"
  | "blue"
  | "purple"
  | "brown"
  | "black"
  | "coral";

// feather: <=150, light: 151-180, middle: 181-200, heavy: >200
export type WeightClass = "unknown" | "feather" | "light" | "middle" | "heavy";
export type AgeClass =
  | "unknown"
  | "kid" // <12
  | "teen"
  | "young-adult" //19-29
  | "30s"
  | "40s"
  | "50s"
  | "60s"
  | "70s"
  | "80s"
  | "90s";

export type Intensity = "playful" | "casual" | "competitive";

export type Category =
  | "submission"
  | "takedown"
  | "sweep"
  | "guard-pass"
  | "reversal"
  | "back-take"
  | "leg-entry"
  | "escape"
  | "tap"
  | "off-balance"
  | "position"
  | "guard-retention"
  | "other";

export type NotificationCategory = "journal-entry-partner" | "chat"; // chat is reserved for a future feature

export type PrivacyType = "public" | "friends-only" | "private";
export type AuthProvider = "google" | "magic-link";

// Database tables
export interface Account {
  id: string;

  // profile
  firstName?: string;
  lastName?: string;
  email: string;
  profilePhoto?: string;

  // stats
  belt: Belt;
  weight: WeightClass;
  birthday: Date;

  // auth metadata
  authUserId: string;
  authProvider: AuthProvider;

  privacySettings: AccountPrivacySettings; // one-to-one

  createdDate: Date;
  updatedDate: Date;
}

// Consolidates all types of training notes and intended attempts
export interface JournalEntry {
  id: string;

  account: Account; // many-to-one

  // Details
  name: string; // What was intention? Could be anything from submission, off-balance, takedown, etc. Rear Naked Choke, Dummy Sweep, Kuzushi, Imanari Roll, Guard Pass. Use tags in the front-end for selection
  category: Category; // User-picked category
  setup: string; // What is the setup to execute the journal entry? Could be from a position, guard, another submission, a saved tag, or free text
  isAttempt: boolean; // Whether this entry represents an intentional technique attempt
  isSuccessful?: boolean; // Undefined for taps and other entries where success does not apply
  notes?: string; // longer text
  intensity?: Intensity;
  isNoGi?: boolean;

  // Training Partner
  trainingPartner?: Account; // many-to-one
  // If training partner not available, allow custom partner stat entry
  partnerWeight?: WeightClass;
  partnerAge?: AgeClass;
  partnerBelt?: Belt;

  trainedDate: Date; // defaults to createdDate when not provided
  createdDate: Date;
  updatedDate: Date;
}

export interface TechniqueTag {
  key: string; // PK in kebab-format

  label: string;
  category: Category;
  generatedBy?: Account; // if undefined, means system generated
  isPublic: boolean; // Admin should constantly review user entries and mark as public

  createdDate: Date;
  updatedDate: Date;
}

export interface Notification {
  id: string;

  heading: string;
  text: string;
  category: NotificationCategory;
  account: Account;
  isRead: boolean;

  createdDate: Date;
  updatedDate: Date;
}

export interface AccountPrivacySettings {
  accountId: string;

  profile: PrivacyType; // default: public
  journalEntries: PrivacyType; // default: friends-only
  submissions: PrivacyType; // default: friends-only
  sweeps: PrivacyType; // default: friends-only
  reversals: PrivacyType; // default: friends-only
  backtakes: PrivacyType; // default: friends-only
  guardPasses: PrivacyType; // default: friends-only
  taps: PrivacyType; // default: friends-only

  createdDate: Date;
  updatedDate: Date;
}
