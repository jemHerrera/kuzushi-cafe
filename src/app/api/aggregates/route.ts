import { authenticatedApiContext } from "@/lib/api/context";
import { apiErrorResponse } from "@/lib/api/errors";
import { aggregateQuerySchema, repeatedSearchParams } from "@/lib/api/schemas";
import { AggregateManager } from "@/lib/managers/aggregate";

export async function GET(request: Request) {
  try {
    const { supabase, accountId } = await authenticatedApiContext();
    const query = aggregateQuerySchema.parse(
      repeatedSearchParams(request.url, ["journalTypes"]),
    );
    return Response.json(
      await new AggregateManager(supabase).getAggregateStats({
        accountId,
        ...query,
      }),
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}
