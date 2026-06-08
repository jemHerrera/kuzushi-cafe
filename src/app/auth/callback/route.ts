import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

import { ensureAccountForUser } from "@/lib/auth/account";
import {
  COMPLETE_PROFILE_PATH,
  safeRelativePath,
  SIGN_IN_PATH,
} from "@/lib/auth/redirects";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function authFailure(request: NextRequest, code: string, next: string) {
  const destination = new URL(SIGN_IN_PATH, request.url);
  destination.searchParams.set("error", code);
  destination.searchParams.set("next", next);
  return NextResponse.redirect(destination, 303);
}

export async function GET(request: NextRequest) {
  const next = safeRelativePath(request.nextUrl.searchParams.get("next"));
  const code = request.nextUrl.searchParams.get("code");
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type") as EmailOtpType | null;

  if (request.nextUrl.searchParams.has("error")) {
    return authFailure(request, "provider_error", next);
  }

  const supabase = await createSupabaseServerClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return authFailure(request, "invalid_callback", next);
    }
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    });

    if (error) {
      return authFailure(request, "expired_link", next);
    }
  } else {
    return authFailure(request, "invalid_callback", next);
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return authFailure(request, "invalid_callback", next);
  }

  try {
    const session = await ensureAccountForUser(supabase, user);
    const destination = new URL(
      session.isProfileComplete ? next : COMPLETE_PROFILE_PATH,
      request.url,
    );

    if (!session.isProfileComplete) {
      destination.searchParams.set("next", next);
    }

    return NextResponse.redirect(destination, 303);
  } catch {
    await supabase.auth.signOut();
    return authFailure(request, "account_error", next);
  }
}
