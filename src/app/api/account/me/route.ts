import { authenticatedApiContext } from "@/lib/api/context";
import { apiErrorResponse, readJson } from "@/lib/api/errors";
import { accountUpdateSchema } from "@/lib/api/schemas";
import { AccountManager } from "@/lib/managers/account";

export async function GET() {
  try {
    const { supabase, accountId } = await authenticatedApiContext();
    return Response.json(
      await new AccountManager(supabase).getAccount({ id: accountId }),
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const { supabase } = await authenticatedApiContext();
    const input = accountUpdateSchema.parse(await readJson(request));
    return Response.json(
      await new AccountManager(supabase).updateAccount(input),
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}
