import { AuthManager } from "@/lib/auth/manager";
import { authErrorResponse, AuthError } from "@/lib/auth/errors";
import { isSafeRelativePath } from "@/lib/auth/redirects";
import type { SignInParams } from "@/lib/auth/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function parseSignInParams(value: unknown): SignInParams {
  if (!value || typeof value !== "object") {
    throw new AuthError("invalid_request", "Invalid sign-in request.", 400);
  }

  const input = value as Record<string, unknown>;
  const redirectTo =
    typeof input.redirectTo === "string" ? input.redirectTo : "/app";

  if (!isSafeRelativePath(redirectTo)) {
    throw new AuthError(
      "invalid_redirect",
      "The requested destination is not allowed.",
      400,
    );
  }

  if (input.provider === "google") {
    return { provider: "google", redirectTo };
  }

  if (input.provider === "magic-link" && typeof input.email === "string") {
    return {
      provider: "magic-link",
      email: input.email,
      redirectTo,
    };
  }

  throw new AuthError("invalid_request", "Invalid sign-in request.", 400);
}

export async function POST(request: Request) {
  try {
    const manager = new AuthManager(await createSupabaseServerClient());
    const params = parseSignInParams(await request.json());
    return Response.json(await manager.signIn(params));
  } catch (error) {
    return authErrorResponse(error);
  }
}
