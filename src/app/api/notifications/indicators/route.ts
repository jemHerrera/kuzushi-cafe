import { authenticatedApiContext } from "@/lib/api/context";
import { apiErrorResponse } from "@/lib/api/errors";
import { NotificationManager } from "@/lib/managers/notification";

export async function GET() {
  try {
    const { supabase, accountId } = await authenticatedApiContext();
    return Response.json(
      await new NotificationManager(supabase).getIndicators({ accountId }),
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}
