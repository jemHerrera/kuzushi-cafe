import { toAccountDetail } from "@/lib/auth/account";
import { apiError, authErrorResponse, AuthError } from "@/lib/auth/errors";
import type { Belt, UpdateAccountParams, WeightClass } from "@/lib/auth/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const belts: Belt[] = [
  "unknown",
  "white",
  "blue",
  "purple",
  "brown",
  "black",
  "coral",
];
const weights: WeightClass[] = [
  "unknown",
  "feather",
  "light",
  "middle",
  "heavy",
];

async function getAuthenticatedUserId() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabase, userId: user?.id };
}

function optionalText(value: unknown, field: string) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (typeof value !== "string" || !value.trim()) {
    throw new AuthError("invalid_profile", `${field} must be valid text.`, 422);
  }

  return value.trim();
}

function parseUpdate(value: unknown): UpdateAccountParams {
  if (!value || typeof value !== "object") {
    throw new AuthError("invalid_profile", "Invalid profile details.", 400);
  }

  const input = value as Record<string, unknown>;
  const firstName =
    typeof input.firstName === "string" ? input.firstName.trim() : "";
  const lastName =
    typeof input.lastName === "string" ? input.lastName.trim() : "";

  if (!firstName || !lastName) {
    throw new AuthError(
      "profile_name_required",
      "First and last name are required.",
      422,
    );
  }

  const belt = input.belt ?? "unknown";
  const weight = input.weight ?? "unknown";

  if (
    !belts.includes(belt as Belt) ||
    !weights.includes(weight as WeightClass)
  ) {
    throw new AuthError(
      "invalid_profile",
      "Select a valid belt and weight.",
      422,
    );
  }

  let birthday: string | undefined;
  if (
    input.birthday !== undefined &&
    input.birthday !== null &&
    input.birthday !== ""
  ) {
    if (
      typeof input.birthday !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(input.birthday) ||
      Number.isNaN(Date.parse(`${input.birthday}T00:00:00Z`)) ||
      Date.parse(`${input.birthday}T00:00:00Z`) > Date.now()
    ) {
      throw new AuthError(
        "invalid_birthday",
        "Enter a valid birthday that is not in the future.",
        422,
      );
    }
    birthday = input.birthday;
  }

  return {
    firstName,
    lastName,
    bio: optionalText(input.bio, "Bio") ?? undefined,
    profilePhoto:
      optionalText(input.profilePhoto, "Profile photo") ?? undefined,
    belt: belt as Belt,
    weight: weight as WeightClass,
    birthday,
  };
}

export async function GET() {
  try {
    const { supabase, userId } = await getAuthenticatedUserId();

    if (!userId) {
      return apiError("authentication_required", "You must be signed in.", 401);
    }

    const { data, error } = await supabase
      .from("accounts")
      .select("*")
      .eq("auth_user_id", userId)
      .single();

    if (error || !data) {
      return apiError("account_not_found", "Account not found.", 404);
    }

    return Response.json(toAccountDetail(data));
  } catch (error) {
    return authErrorResponse(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const { supabase, userId } = await getAuthenticatedUserId();

    if (!userId) {
      return apiError("authentication_required", "You must be signed in.", 401);
    }

    const input = parseUpdate(await request.json());
    const { data, error } = await supabase
      .from("accounts")
      .update({
        first_name: input.firstName,
        last_name: input.lastName,
        bio: input.bio ?? null,
        profile_photo: input.profilePhoto ?? null,
        belt: input.belt,
        weight: input.weight,
        birthday: input.birthday ?? null,
      })
      .eq("auth_user_id", userId)
      .select("*")
      .single();

    if (error || !data) {
      throw new AuthError(
        "profile_update_failed",
        "We could not save your profile.",
        500,
      );
    }

    return Response.json(toAccountDetail(data));
  } catch (error) {
    return authErrorResponse(error);
  }
}
