import { optionalApiContext } from "@/lib/api/context";
import { apiErrorResponse } from "@/lib/api/errors";
import { parseJournalQuery } from "@/lib/api/journal-query";
import { pathIdSchema } from "@/lib/api/schemas";
import { AccountManager } from "@/lib/managers/account";
import { JournalEntryManager } from "@/lib/managers/journal";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { supabase, accountId: viewerAccountId } = await optionalApiContext();
    const { id: accountId } = pathIdSchema.parse(await params);
    const query = parseJournalQuery(request.url);
    const accountManager = new AccountManager(supabase);
    const privacy = await accountManager.getPublicPrivacy({
      accountId,
      viewerAccountId,
    });
    const result = await new JournalEntryManager(supabase).getJournalEntries({
      accountId,
      ...query,
    });
    return Response.json({ ...result, visibility: privacy.journalEntries });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
