import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { ensureAccountForUser } from "@/lib/auth/account";
import { AuthError } from "@/lib/auth/errors";
import { safeRelativePath } from "@/lib/auth/redirects";
import type {
  AuthSessionDetail,
  SignInParams,
  SignInResult,
} from "@/lib/auth/types";
import { getPublicEnv } from "@/lib/env";
import type { Database } from "@/lib/supabase/database.types";

export class AuthManager {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async signIn(params: SignInParams): Promise<SignInResult> {
    const env = getPublicEnv();
    const next = safeRelativePath(params.redirectTo);
    const callbackUrl = new URL("/auth/callback", env.siteUrl);
    callbackUrl.searchParams.set("next", next);

    if (params.provider === "google") {
      const { data, error } = await this.supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: callbackUrl.toString(),
          skipBrowserRedirect: true,
        },
      });

      if (error || !data.url) {
        throw new AuthError(
          "provider_unavailable",
          "Google sign-in is unavailable right now.",
          503,
        );
      }

      return {
        object: "sign_in_result",
        provider: "google",
        status: "redirect_required",
        redirectUrl: data.url,
      };
    }

    const email = params.email.trim().toLowerCase();

    if (!email) {
      throw new AuthError("email_required", "Enter your email address.", 422);
    }

    const { error } = await this.supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: callbackUrl.toString(),
        shouldCreateUser: true,
      },
    });

    if (error) {
      if (error.status === 429) {
        throw new AuthError(
          "rate_limited",
          "Please wait before requesting another sign-in link.",
          429,
        );
      }

      throw new AuthError(
        "magic_link_failed",
        "We could not send a sign-in link.",
        503,
      );
    }

    return {
      object: "sign_in_result",
      provider: "magic-link",
      status: "magic_link_sent",
      email,
    };
  }

  async getCurrentSession(): Promise<AuthSessionDetail | null> {
    const {
      data: { user },
      error,
    } = await this.supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return ensureAccountForUser(this.supabase, user);
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();

    if (error) {
      throw new AuthError("sign_out_failed", "We could not sign you out.", 500);
    }

    return { signedOut: true as const };
  }
}
