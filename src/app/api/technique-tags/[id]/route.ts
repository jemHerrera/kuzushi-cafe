import { authenticatedApiContext } from "@/lib/api/context";
import { apiErrorResponse, readJson } from "@/lib/api/errors";
import { pathKeySchema, tagUpdateSchema } from "@/lib/api/schemas";
import { JournalEntryManager } from "@/lib/managers/journal";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { supabase, accountId } = await authenticatedApiContext();
    const { id } = pathKeySchema.parse(await params);
    const options = tagUpdateSchema.parse(await readJson(request));
    return Response.json(
      await new JournalEntryManager(supabase).updateTag({
        accountId,
        id,
        options: { ...options, isPublic: false },
      }),
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { supabase, accountId } = await authenticatedApiContext();
    const { id } = pathKeySchema.parse(await params);
    return Response.json(
      await new JournalEntryManager(supabase).deleteTags({
        accountId,
        id: [id],
      }),
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}
