import { AuthManager } from "@/lib/auth/manager";
import { authErrorResponse } from "@/lib/auth/errors";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const manager = new AuthManager(await createSupabaseServerClient());
    return Response.json(await manager.getCurrentSession());
  } catch (error) {
    return authErrorResponse(error);
  }
}
