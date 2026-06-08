import { optionalApiContext } from "@/lib/api/context";
import { apiErrorResponse } from "@/lib/api/errors";
import {
  aggregateQuerySchema,
  pathIdSchema,
  repeatedSearchParams,
} from "@/lib/api/schemas";
import { AccountManager } from "@/lib/managers/account";
import { AggregateManager } from "@/lib/managers/aggregate";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { supabase, accountId: viewerAccountId } = await optionalApiContext();
    const { id: accountId } = pathIdSchema.parse(await params);
    const query = aggregateQuerySchema.parse(
      repeatedSearchParams(request.url, ["journalTypes"]),
    );
    const privacy = await new AccountManager(supabase).getPublicPrivacy({
      accountId,
      viewerAccountId,
    });
    const result = await new AggregateManager(supabase).getAggregateStats({
      accountId,
      ...query,
    });
    return Response.json({ ...result, visibility: privacy.journalEntries });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
