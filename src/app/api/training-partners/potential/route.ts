import { authenticatedApiContext } from "@/lib/api/context";
import { apiErrorResponse } from "@/lib/api/errors";
import { searchPaginationSchema, searchParamsObject } from "@/lib/api/schemas";
import { AccountManager } from "@/lib/managers/account";

export async function GET(request: Request) {
  try {
    const { supabase, accountId } = await authenticatedApiContext();
    const query = searchPaginationSchema.parse(searchParamsObject(request.url));
    return Response.json(
      await new AccountManager(supabase).getPotentialTrainingPartners({
        accountId,
        ...query,
      }),
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}
