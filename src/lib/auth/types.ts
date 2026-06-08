export type {
  AccountDetail,
  ApiErrorDetail,
  AuthProvider,
  AuthSessionDetail,
  Belt,
  SignInParams,
  SignInResult,
  WeightClass,
} from "@/lib/managers/types";

import type { Belt, WeightClass } from "@/lib/managers/types";

export type UpdateAccountParams = {
  firstName: string;
  lastName: string;
  bio?: string;
  profilePhoto?: string;
  belt?: Belt;
  weight?: WeightClass;
  birthday?: string;
};
