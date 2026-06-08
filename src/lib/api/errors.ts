import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { AuthError } from "@/lib/auth/errors";
import { ManagerError } from "@/lib/managers/errors";
import type { ApiErrorDetail } from "@/lib/managers/types";

export class ApiError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly status = 400,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function apiError(
  code: string,
  message: string,
  status: number,
  issues?: ApiErrorDetail["error"]["issues"],
) {
  return NextResponse.json<ApiErrorDetail>(
    { error: { code, message, ...(issues?.length ? { issues } : {}) } },
    { status },
  );
}

export function apiErrorResponse(error: unknown) {
  if (error instanceof ZodError) {
    return apiError(
      "validation_failed",
      "The request contains invalid values.",
      422,
      error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    );
  }
  if (error instanceof ApiError || error instanceof ManagerError) {
    return apiError(error.code, error.message, error.status);
  }
  if (error instanceof AuthError) {
    return apiError(error.code, error.message, error.status);
  }
  return apiError(
    "internal_error",
    "Something went wrong. Please try again.",
    500,
  );
}

export async function readJson(request: Request) {
  try {
    return await request.json();
  } catch {
    throw new ApiError(
      "invalid_json",
      "The request body must be valid JSON.",
      400,
    );
  }
}
