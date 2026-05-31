export type Belt = "white" | "blue" | "purple" | "brown" | "black" | "coral";

// feather: <=150, light: 151-180, middle: 181-200, heavy: >200
export type WeightClass = "feather" | "light" | "middle" | "heavy";
export type AgeClass =
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

export type TechniqueCategory =
  | "submission"
  | "takedown"
  | "sweep"
  | "guard-pass"
  | "reversal"
  | "back-take"
  | "leg-entry"
  | "escape"
  | "off-balance"
  | "position"
  | "guard-retention"
  | "other";

export type NotificationCategory = "technique-partner" | "chat";

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

  // metadata
  googleUserId: string;
  googleEmailAddress?: string;

  createdDate: Date;
  updatedDate: Date;
}

// Consolidates all types of intended attempt
export interface Technique {
  id: string;

  account: Account; // many-to-one

  // Details
  name: string; // What was intention? Could be anything from submission, off-balance, takedown, etc. Rear Naked Choke, Dummy Sweep, Kuzushi, Imanari Roll, Guard Pass. Use tags in the front-end for selection
  category: TechniqueCategory; // Based on tags picked from technique, automatically infer. If a new technique is created, create a new tag and save the user-picked category assignment
  setup: string; // What is the setup to execute the technique? could be from a position, guard, or another submission. Use tags
  isSuccessful: boolean; // Whether the technique execution was successful. Success criteria is completely based on the user
  notes?: string; // longer text
  intensity: Intensity;
  isNoGi?: boolean;

  // Training Partner
  trainingPartner?: Account; // many-to-one
  // If training partner not available, allow custom partner stat entry
  partnerWeight?: WeightClass;
  partnerAge?: AgeClass;
  partnerBelt?: Belt;

  trainedDate: Date;
  createdDate: Date;
  updatedDate: Date;
}

export interface TechniqueTag {
  key: string; // PK in kebab-format

  label: string;
  category: TechniqueCategory;
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
