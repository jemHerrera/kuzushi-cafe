import { authenticatedApiContext } from "@/lib/api/context";
import { apiErrorResponse, readJson } from "@/lib/api/errors";
import { privacyUpdateSchema } from "@/lib/api/schemas";
import { AccountManager } from "@/lib/managers/account";

export async function GET() {
  try {
    const { supabase, accountId } = await authenticatedApiContext();
    return Response.json(
      await new AccountManager(supabase).getPrivacySettings({ accountId }),
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const { supabase, accountId } = await authenticatedApiContext();
    const options = privacyUpdateSchema.parse(await readJson(request));
    return Response.json(
      await new AccountManager(supabase).updatePrivacySettings({
        accountId,
        options,
      }),
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}
