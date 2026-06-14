import { authenticatedApiContext } from "@/lib/api/context";
import { apiErrorResponse, readJson } from "@/lib/api/errors";
import { parseJournalQuery } from "@/lib/api/journal-query";
import { journalCreateSchema } from "@/lib/api/schemas";
import { JournalEntryManager } from "@/lib/managers/journal";
import { NotificationManager } from "@/lib/managers/notification";

export async function GET(request: Request) {
  try {
    const { supabase, accountId } = await authenticatedApiContext();
    const query = parseJournalQuery(request.url);
    return Response.json(
      await new JournalEntryManager(supabase).getJournalEntries({
        accountId,
        ...query,
      }),
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const { supabase, accountId } = await authenticatedApiContext();
    const input = journalCreateSchema.parse(await readJson(request));
    const { createNameTag, createSetupTag, ...values } = input;
    const manager = new JournalEntryManager(supabase);
    if (createNameTag) {
      await manager.createTag({
        category: values.category,
        generatedBy: accountId,
        label: values.name,
      });
    }
    if (createSetupTag) {
      await manager.createTag({
        category: values.category,
        generatedBy: accountId,
        label: values.setup,
      });
    }
    const entry = await manager.createJournalEntry({ accountId, ...values });
    if (
      values.trainingPartnerId &&
      (await manager.isAcceptedTrainingPartner({
        accountId,
        trainingPartnerId: values.trainingPartnerId,
      }))
    ) {
      await new NotificationManager(
        supabase,
      ).sendJournalEntryAssignmentNotification({
        accountId,
        journalEntryId: entry.id,
      });
    }
    return Response.json(entry, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
