import { authenticatedApiContext } from "@/lib/api/context";
import { apiErrorResponse } from "@/lib/api/errors";
import { pathIdSchema } from "@/lib/api/schemas";
import { AccountManager } from "@/lib/managers/account";

async function context(params: Promise<{ id: string }>) {
  const { supabase, accountId } = await authenticatedApiContext();
  return {
    manager: new AccountManager(supabase),
    accountId,
    id: pathIdSchema.parse(await params).id,
  };
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { manager, accountId, id } = await context(params);
    return Response.json(
      await manager.blockAccount({ accountId, blockedAccountId: id }),
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
    const { manager, accountId, id } = await context(params);
    return Response.json(
      await manager.unblockAccount({ accountId, blockedAccountId: id }),
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}
