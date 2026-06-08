import { AuthManager } from "@/lib/auth/manager";
import { authenticatedApiContext } from "@/lib/api/context";
import { apiErrorResponse } from "@/lib/api/errors";

export async function POST() {
  try {
    const { supabase } = await authenticatedApiContext();
    const manager = new AuthManager(supabase);
    return Response.json(await manager.signOut());
  } catch (error) {
    return apiErrorResponse(error);
  }
}
