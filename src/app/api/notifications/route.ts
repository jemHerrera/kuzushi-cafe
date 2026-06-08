import { authenticatedApiContext } from "@/lib/api/context";
import { apiErrorResponse } from "@/lib/api/errors";
import { paginationSchema, searchParamsObject } from "@/lib/api/schemas";
import { NotificationManager } from "@/lib/managers/notification";

export async function GET(request: Request) {
  try {
    const { supabase, accountId } = await authenticatedApiContext();
    const query = paginationSchema.parse(searchParamsObject(request.url));
    return Response.json(
      await new NotificationManager(supabase).getNotifications({
        accountId,
        ...query,
      }),
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}
