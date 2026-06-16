import { authenticatedApiContext } from "@/lib/api/context";
import { apiErrorResponse } from "@/lib/api/errors";
import {
  pathIdSchema,
  searchParamsObject,
  statsQuerySchema,
} from "@/lib/api/schemas";
import { StatsManager } from "@/lib/managers/stats";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { supabase, accountId: viewerAccountId } =
      await authenticatedApiContext();
    const { id: accountId } = pathIdSchema.parse(await params);
    const query = statsQuerySchema.parse(searchParamsObject(request.url));
    return Response.json(
      await new StatsManager(supabase).getPublicStats({
        accountId,
        viewerAccountId,
        ...query,
      }),
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}
