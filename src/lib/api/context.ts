import type { SupabaseClient } from "@supabase/supabase-js";

import { ApiError } from "@/lib/api/errors";
import { AuthManager } from "@/lib/auth/manager";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type ApiContext = {
  supabase: SupabaseClient<Database>;
  accountId?: string;
};

export async function optionalApiContext(): Promise<ApiContext> {
  const supabase = await createSupabaseServerClient();
  const session = await new AuthManager(supabase).getCurrentSession();
  return { supabase, accountId: session?.account.id };
}

export async function authenticatedApiContext(): Promise<
  ApiContext & { accountId: string }
> {
  const context = await optionalApiContext();
  if (!context.accountId) {
    throw new ApiError(
      "authentication_required",
      "You must be signed in.",
      401,
    );
  }
  return { ...context, accountId: context.accountId };
}
