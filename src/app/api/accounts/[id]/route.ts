import { optionalApiContext } from "@/lib/api/context";
import { apiErrorResponse } from "@/lib/api/errors";
import { pathIdSchema } from "@/lib/api/schemas";
import { AccountManager } from "@/lib/managers/account";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { supabase, accountId } = await optionalApiContext();
    const { id } = pathIdSchema.parse(await params);
    return Response.json(
      await new AccountManager(supabase).getPublicProfile({
        accountId: id,
        viewerAccountId: accountId,
      }),
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}
