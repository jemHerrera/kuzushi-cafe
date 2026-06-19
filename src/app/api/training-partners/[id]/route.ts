import { authenticatedApiContext } from "@/lib/api/context";
import { apiErrorResponse } from "@/lib/api/errors";
import { customPartnerSchema, pathIdSchema } from "@/lib/api/schemas";
import { AccountManager } from "@/lib/managers/account";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { supabase, accountId } = await authenticatedApiContext();
    const { id } = pathIdSchema.parse(await params);
    const body = customPartnerSchema.parse(await request.json());
    return Response.json(
      await new AccountManager(supabase).updateCustomTrainingPartner({
        accountId,
        trainingPartnerId: id,
        ...body,
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
    const { id } = pathIdSchema.parse(await params);
    return Response.json(
      await new AccountManager(supabase).removeTrainingPartner({
        accountId,
        trainingPartnerId: id,
      }),
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}
