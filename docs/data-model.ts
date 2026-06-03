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

export type Intensity = "playful" | "casual" | "intense";

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

export type PrivacyType = "public" | "training-partners" | "private";
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
  trainingPartnerRequestsSent: TrainingPartnerRequest[];
  trainingPartnerRequestsReceived: TrainingPartnerRequest[];
  trainingPartners: TrainingPartner[];
  trainingPartnerBy: TrainingPartner[];

  createdDate: Date;
  updatedDate: Date;
}

export interface TrainingPartnerRequest {
  id: string;
  requester: Account; // many-to-one
  recipient: Account; // many-to-one
  // One pending request may exist between two accounts at a time.
  // Accepting a request deletes it and creates reciprocal TrainingPartner rows.

  createdDate: Date;
  updatedDate: Date;
}

export interface TrainingPartner {
  id: string;
  owner: Account; // many-to-one
  partner?: Account; // many-to-one, nullable because training partner can be custom
  // Account-backed training partners are reciprocal: when account A accepts account B,
  // one row is created for owner A -> partner B and one row for owner B -> partner A.
  // Removing either side keeps both rows, clears partner on both rows, and copies
  // the former partner's first name, last name, age, weight, and belt into the
  // owner-only snapshot fields below.
  // Snapshot age is derived from the former partner's birthday at removal time.
  // If training partner not available, allow custom partner stat entry.
  firstName?: string;
  lastName?: string;
  partnerWeight?: WeightClass;
  partnerAge?: AgeClass;
  partnerBelt?: Belt;

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
  trainingPartner?: TrainingPartner; // many-to-one

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
  journalEntries: PrivacyType; // default: training-partners
  submissions: PrivacyType; // default: training-partners
  sweeps: PrivacyType; // default: training-partners
  reversals: PrivacyType; // default: training-partners
  backtakes: PrivacyType; // default: training-partners
  guardPasses: PrivacyType; // default: training-partners
  taps: PrivacyType; // default: training-partners

  createdDate: Date;
  updatedDate: Date;
}
