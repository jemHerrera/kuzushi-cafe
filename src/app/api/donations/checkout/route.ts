import { authenticatedApiContext } from "@/lib/api/context";
import { apiErrorResponse, readJson } from "@/lib/api/errors";
import { donationCheckoutSchema } from "@/lib/api/schemas";
import { DonationManager } from "@/lib/managers/donation";

export async function POST(request: Request) {
  try {
    const { supabase, accountId } = await authenticatedApiContext();
    const input = donationCheckoutSchema.parse(await readJson(request));
    const result = await new DonationManager(supabase).createCheckoutSession({
      accountId,
      ...input,
    });
    return Response.json({ checkoutUrl: result.checkoutUrl }, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
