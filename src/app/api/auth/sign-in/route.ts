import { AuthManager } from "@/lib/auth/manager";
import { apiErrorResponse, readJson } from "@/lib/api/errors";
import { signInSchema } from "@/lib/api/schemas";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const manager = new AuthManager(await createSupabaseServerClient());
    const params = signInSchema.parse(await readJson(request));
    return Response.json(await manager.signIn(params));
  } catch (error) {
    return apiErrorResponse(error);
  }
}
