import { optionalApiContext } from "@/lib/api/context";
import { apiErrorResponse } from "@/lib/api/errors";
import { pathIdSchema } from "@/lib/api/schemas";
import { AccountManager } from "@/lib/managers/account";
import { TrainingActivityManager } from "@/lib/managers/training-activity";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { supabase, accountId: viewerAccountId } = await optionalApiContext();
    const { id: accountId } = pathIdSchema.parse(await params);
    const privacy = await new AccountManager(supabase).getPublicPrivacy({
      accountId,
      viewerAccountId,
    });
    const result = await new TrainingActivityManager(
      supabase,
    ).getTrainingActivity({ accountId });
    return Response.json({ ...result, visibility: privacy.journalEntries });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
