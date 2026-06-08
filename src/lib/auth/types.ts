import type { Database } from "@/lib/supabase/database.types";

export type AuthProvider = Database["public"]["Enums"]["auth_provider"];
export type Belt = Database["public"]["Enums"]["belt"];
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

export type ApiErrorDetail = {
  error: {
    code: string;
    message: string;
  };
};

export type UpdateAccountParams = {
  firstName: string;
  lastName: string;
  bio?: string;
  profilePhoto?: string;
  belt?: Belt;
  weight?: WeightClass;
  birthday?: string;
};
