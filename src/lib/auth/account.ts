import "server-only";

import type { SupabaseClient, User } from "@supabase/supabase-js";

import { AuthError } from "@/lib/auth/errors";
import type {
  AccountDetail,
  AuthProvider,
  AuthSessionDetail,
} from "@/lib/auth/types";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/database.types";

type AccountRow = Database["public"]["Tables"]["accounts"]["Row"];

export function toAccountDetail(row: AccountRow): AccountDetail {
  return {
    id: row.id,
    object: "account",
    firstName: row.first_name ?? undefined,
    lastName: row.last_name ?? undefined,
    bio: row.bio ?? undefined,
    email: row.email,
    profilePhoto: row.profile_photo ?? undefined,
    belt: row.belt,
    weight: row.weight,
    birthday: row.birthday
      ? new Date(`${row.birthday}T00:00:00Z`).getTime()
      : undefined,
    donated: row.donated,
    createdAt: new Date(row.created_date).getTime(),
    updatedAt: new Date(row.updated_date).getTime(),
  };
}

export function isProfileComplete(row: AccountRow) {
  return Boolean(row.first_name?.trim() && row.last_name?.trim());
}

function getAuthProvider(user: User): AuthProvider {
  return user.app_metadata.provider === "google" ? "google" : "magic-link";
}

async function findAccount(
  supabase: SupabaseClient<Database>,
  authUserId: string,
) {
  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("auth_user_id", authUserId)
    .maybeSingle();

  if (error) {
    throw new AuthError(
      "account_lookup_failed",
      "We could not load your account.",
      500,
    );
  }

  return data;
}

export async function ensureAccountForUser(
  supabase: SupabaseClient<Database>,
  user: User,
): Promise<AuthSessionDetail> {
  const email = user.email?.trim().toLowerCase();

  if (!email || !user.email_confirmed_at) {
    throw new AuthError(
      "verified_email_required",
      "A verified email address is required to create an account.",
      422,
    );
  }

  const existingAccount = await findAccount(supabase, user.id);

  if (existingAccount) {
    return {
      object: "auth_session",
      account: toAccountDetail(existingAccount),
      isNewAccount: false,
      isProfileComplete: isProfileComplete(existingAccount),
    };
  }

  const admin = createSupabaseAdminClient();
  const { data: createdAccount, error } = await admin
    .from("accounts")
    .insert({
      auth_user_id: user.id,
      auth_provider: getAuthProvider(user),
      email,
      profile_photo:
        typeof user.user_metadata.avatar_url === "string"
          ? user.user_metadata.avatar_url
          : null,
    })
    .select("*")
    .single();

  if (!error && createdAccount) {
    return {
      object: "auth_session",
      account: toAccountDetail(createdAccount),
      isNewAccount: true,
      isProfileComplete: isProfileComplete(createdAccount),
    };
  }

  const concurrentlyCreatedAccount = await findAccount(supabase, user.id);

  if (concurrentlyCreatedAccount) {
    return {
      object: "auth_session",
      account: toAccountDetail(concurrentlyCreatedAccount),
      isNewAccount: false,
      isProfileComplete: isProfileComplete(concurrentlyCreatedAccount),
    };
  }

  if (error?.code === "23505") {
    throw new AuthError(
      "email_already_linked",
      "That email address is already linked to another account.",
      409,
    );
  }

  throw new AuthError(
    "account_creation_failed",
    "We could not create your account.",
    500,
  );
}
