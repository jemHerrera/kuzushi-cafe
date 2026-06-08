import { authenticatedApiContext } from "@/lib/api/context";
import { apiErrorResponse, readJson } from "@/lib/api/errors";
import { customPartnerSchema } from "@/lib/api/schemas";
import { AccountManager } from "@/lib/managers/account";

export async function POST(request: Request) {
  try {
    const { supabase, accountId } = await authenticatedApiContext();
    const input = customPartnerSchema.parse(await readJson(request));
    return Response.json(
      await new AccountManager(supabase).createCustomTrainingPartner({
        accountId,
        ...input,
      }),
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}
