import { NextResponse, type NextRequest } from "next/server";

import {
  COMPLETE_PROFILE_PATH,
  DEFAULT_AUTHENTICATED_PATH,
  requestPathWithSearch,
  SIGN_IN_PATH,
  withNext,
} from "@/lib/auth/redirects";
import { createSupabaseProxyClient } from "@/lib/supabase/proxy";

function copyCookies(source: NextResponse, target: NextResponse) {
  source.cookies.getAll().forEach((cookie) => {
    target.cookies.set(cookie);
  });

  return target;
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const hasAuthCallbackParams =
    request.nextUrl.searchParams.has("code") ||
    request.nextUrl.searchParams.has("token_hash") ||
    request.nextUrl.searchParams.has("error");

  if (pathname === "/" && hasAuthCallbackParams) {
    const callbackUrl = new URL("/auth/callback", request.url);
    callbackUrl.search = request.nextUrl.search;

    if (!callbackUrl.searchParams.has("next")) {
      callbackUrl.searchParams.set("next", DEFAULT_AUTHENTICATED_PATH);
    }

    return NextResponse.redirect(callbackUrl, 307);
  }

  const { supabase, getResponse } = createSupabaseProxyClient(request);
  const { data: claimsData } = await supabase.auth.getClaims();
  const claims = claimsData?.claims;
  const isProtectedPage =
    pathname === "/app" ||
    pathname.startsWith("/app/") ||
    pathname.startsWith("/profiles/");
  const isSignInPage = pathname === SIGN_IN_PATH;
  const isCompleteProfilePage = pathname === COMPLETE_PROFILE_PATH;

  if (!claims?.sub) {
    if (isProtectedPage || isCompleteProfilePage) {
      const signInUrl = new URL(
        withNext(SIGN_IN_PATH, requestPathWithSearch(request.nextUrl)),
        request.url,
      );
      return copyCookies(getResponse(), NextResponse.redirect(signInUrl, 307));
    }

    return getResponse();
  }

  let isProfileComplete = false;
  const { data: account } = await supabase
    .from("accounts")
    .select("first_name,last_name")
    .eq("auth_user_id", claims.sub)
    .maybeSingle();

  isProfileComplete = Boolean(
    account?.first_name?.trim() && account.last_name?.trim(),
  );

  if (isSignInPage) {
    const destination = new URL(
      isProfileComplete ? DEFAULT_AUTHENTICATED_PATH : COMPLETE_PROFILE_PATH,
      request.url,
    );
    return copyCookies(getResponse(), NextResponse.redirect(destination, 307));
  }

  if (isCompleteProfilePage && isProfileComplete) {
    const destination = new URL(DEFAULT_AUTHENTICATED_PATH, request.url);
    return copyCookies(getResponse(), NextResponse.redirect(destination, 307));
  }

  if (isProtectedPage && !isProfileComplete) {
    const destination = new URL(
      withNext(COMPLETE_PROFILE_PATH, requestPathWithSearch(request.nextUrl)),
      request.url,
    );
    return copyCookies(getResponse(), NextResponse.redirect(destination, 307));
  }

  return getResponse();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
