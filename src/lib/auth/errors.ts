import { NextResponse } from "next/server";

import type { ApiErrorDetail } from "@/lib/auth/types";

export class AuthError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly status = 400,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export function apiError(code: string, message: string, status: number) {
  return NextResponse.json<ApiErrorDetail>(
    { error: { code, message } },
    { status },
  );
}

export function authErrorResponse(error: unknown) {
  if (error instanceof AuthError) {
    return apiError(error.code, error.message, error.status);
  }

  return apiError(
    "internal_error",
    "Something went wrong. Please try again.",
    500,
  );
}
