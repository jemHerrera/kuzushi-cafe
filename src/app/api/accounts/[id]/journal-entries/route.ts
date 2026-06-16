import { authenticatedApiContext } from "@/lib/api/context";
import { apiErrorResponse } from "@/lib/api/errors";
import { parseJournalQuery } from "@/lib/api/journal-query";
import { pathIdSchema } from "@/lib/api/schemas";
import { JournalEntryManager } from "@/lib/managers/journal";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { supabase } = await authenticatedApiContext();
    const { id: accountId } = pathIdSchema.parse(await params);
    const query = parseJournalQuery(request.url);
    const result = await new JournalEntryManager(supabase).getJournalEntries({
      accountId,
      ...query,
    });
    return Response.json(result);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
