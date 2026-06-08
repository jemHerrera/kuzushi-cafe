import { authenticatedApiContext } from "@/lib/api/context";
import { apiErrorResponse } from "@/lib/api/errors";
import { requestDirectionSchema, searchParamsObject } from "@/lib/api/schemas";
import { AccountManager } from "@/lib/managers/account";

export async function GET(request: Request) {
  try {
    const { supabase, accountId } = await authenticatedApiContext();
    const query = requestDirectionSchema.parse(searchParamsObject(request.url));
    return Response.json(
      await new AccountManager(supabase).getTrainingPartnerRequests({
        accountId,
        ...query,
      }),
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}
