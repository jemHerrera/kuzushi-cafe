import { authenticatedApiContext } from "@/lib/api/context";
import { apiErrorResponse } from "@/lib/api/errors";
import { checkoutStatusSchema, searchParamsObject } from "@/lib/api/schemas";
import { DonationManager } from "@/lib/managers/donation";

export async function GET(request: Request) {
  try {
    const { supabase, accountId } = await authenticatedApiContext();
    const query = checkoutStatusSchema.parse(searchParamsObject(request.url));
    return Response.json(
      await new DonationManager(supabase).getCheckoutStatus({
        accountId,
        ...query,
      }),
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}
