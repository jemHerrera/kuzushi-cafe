import { AuthManager } from "@/lib/auth/manager";
import { apiError, authErrorResponse } from "@/lib/auth/errors";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const manager = new AuthManager(await createSupabaseServerClient());
    const session = await manager.getCurrentSession();

    if (!session) {
      return apiError("authentication_required", "You must be signed in.", 401);
    }

    return Response.json(await manager.signOut());
  } catch (error) {
    return authErrorResponse(error);
  }
}
