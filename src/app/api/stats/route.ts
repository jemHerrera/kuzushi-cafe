import { authenticatedApiContext } from "@/lib/api/context";
import { apiErrorResponse } from "@/lib/api/errors";
import { searchParamsObject, statsQuerySchema } from "@/lib/api/schemas";
import { StatsManager } from "@/lib/managers/stats";

export async function GET(request: Request) {
  try {
    const { supabase, accountId } = await authenticatedApiContext();
    const query = statsQuerySchema.parse(searchParamsObject(request.url));
    return Response.json(
      await new StatsManager(supabase).getStats({ accountId, ...query }),
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}
