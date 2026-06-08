import { authenticatedApiContext } from "@/lib/api/context";
import { apiErrorResponse } from "@/lib/api/errors";
import { pathIdSchema } from "@/lib/api/schemas";
import { AccountManager } from "@/lib/managers/account";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { supabase, accountId } = await authenticatedApiContext();
    const { id } = pathIdSchema.parse(await params);
    return Response.json(
      await new AccountManager(supabase).acceptTrainingPartnerRequest({
        accountId,
        requesterAccountId: id,
      }),
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}
