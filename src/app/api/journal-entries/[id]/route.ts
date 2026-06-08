import { authenticatedApiContext } from "@/lib/api/context";
import { apiErrorResponse, readJson } from "@/lib/api/errors";
import { journalUpdateSchema, pathIdSchema } from "@/lib/api/schemas";
import { JournalEntryManager } from "@/lib/managers/journal";
import { NotificationManager } from "@/lib/managers/notification";

async function routeContext(params: Promise<{ id: string }>) {
  const { supabase, accountId } = await authenticatedApiContext();
  return {
    supabase,
    accountId,
    id: pathIdSchema.parse(await params).id,
    manager: new JournalEntryManager(supabase),
  };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { manager, accountId, id } = await routeContext(params);
    return Response.json(await manager.getJournalEntry({ accountId, id }));
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { manager, supabase, accountId, id } = await routeContext(params);
    const options = journalUpdateSchema.parse(await readJson(request));
    const entry = await manager.updateJournalEntry({ accountId, id, options });
    if (options.trainingPartnerId) {
      await new NotificationManager(
        supabase,
      ).sendJournalEntryAssignmentNotification({
        accountId,
        journalEntryId: id,
      });
    }
    return Response.json(entry);
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { manager, accountId, id } = await routeContext(params);
    return Response.json(
      await manager.deleteJournalEntries({ accountId, id: [id] }),
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}
