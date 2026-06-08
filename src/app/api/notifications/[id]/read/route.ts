import { authenticatedApiContext } from "@/lib/api/context";
import { apiErrorResponse } from "@/lib/api/errors";
import { pathIdSchema } from "@/lib/api/schemas";
import { NotificationManager } from "@/lib/managers/notification";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { supabase, accountId } = await authenticatedApiContext();
    const { id } = pathIdSchema.parse(await params);
    return Response.json(
      await new NotificationManager(supabase).markNotificationAsRead({
        accountId,
        id,
      }),
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}
