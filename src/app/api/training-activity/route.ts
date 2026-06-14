import { authenticatedApiContext } from "@/lib/api/context";
import { apiErrorResponse } from "@/lib/api/errors";
import { TrainingActivityManager } from "@/lib/managers/training-activity";

export async function GET() {
  try {
    const { supabase, accountId } = await authenticatedApiContext();
    return Response.json(
      await new TrainingActivityManager(supabase).getTrainingActivity({
        accountId,
      }),
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}
