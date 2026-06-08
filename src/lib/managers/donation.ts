import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import Stripe from "stripe";

import { getServerEnv } from "@/lib/env";
import { ManagerError } from "@/lib/managers/errors";
import type {
  DonationCheckoutSessionDetail,
  DonationCheckoutStatus,
} from "@/lib/managers/types";
import type { Database } from "@/lib/supabase/database.types";

type DonationRow =
  Database["public"]["Tables"]["donation_checkout_sessions"]["Row"];

export class DonationManager {
  constructor(
    private readonly supabase: SupabaseClient<Database>,
    private readonly stripe: Stripe = createStripeClient(),
  ) {}

  async createCheckoutSession(params: {
    accountId: string;
    amount: number;
    currency?: "usd";
    successUrl: string;
    cancelUrl: string;
  }): Promise<DonationCheckoutSessionDetail> {
    validateAmount(params.amount);
    const successUrl = validateCheckoutUrl(params.successUrl);
    const cancelUrl = validateCheckoutUrl(params.cancelUrl);
    successUrl.searchParams.set("session_id", "{CHECKOUT_SESSION_ID}");

    let session: Stripe.Checkout.Session;
    try {
      session = await this.stripe.checkout.sessions.create({
        mode: "payment",
        client_reference_id: params.accountId,
        metadata: { accountId: params.accountId, kind: "donation" },
        success_url: successUrl.toString(),
        cancel_url: cancelUrl.toString(),
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: params.currency ?? "usd",
              unit_amount: params.amount * 100,
              product_data: {
                name: "Kuzushi Cafe donation",
                description: "Support hosting and ongoing development.",
              },
            },
          },
        ],
      });
    } catch {
      throw new ManagerError(
        "checkout_creation_failed",
        "Stripe Checkout is temporarily unavailable.",
        503,
      );
    }

    if (!session.url) {
      throw new ManagerError(
        "checkout_url_missing",
        "Stripe did not return a checkout URL.",
        503,
      );
    }

    const { data, error } = await this.supabase
      .from("donation_checkout_sessions")
      .insert({
        id: session.id,
        account_id: params.accountId,
        amount: params.amount,
        currency: "usd",
        checkout_url: session.url,
        status: "retryable-failure",
      })
      .select("*")
      .single();
    if (error || !data) {
      throw new ManagerError(
        "checkout_persistence_failed",
        error?.message ?? "Could not save checkout session.",
        500,
      );
    }
    return toDonationCheckout(data);
  }

  async getCheckoutStatus(params: {
    accountId: string;
    sessionId: string;
  }): Promise<{ status: DonationCheckoutStatus }> {
    const { data: stored, error } = await this.supabase
      .from("donation_checkout_sessions")
      .select("*")
      .eq("id", params.sessionId)
      .eq("account_id", params.accountId)
      .single();
    if (error || !stored) {
      throw new ManagerError(
        "checkout_not_found",
        "Donation checkout session not found.",
        404,
      );
    }

    let session: Stripe.Checkout.Session;
    try {
      session = await this.stripe.checkout.sessions.retrieve(params.sessionId);
    } catch {
      return { status: "retryable-failure" };
    }

    if (
      session.client_reference_id !== params.accountId ||
      session.metadata?.accountId !== params.accountId
    ) {
      throw new ManagerError(
        "checkout_account_mismatch",
        "Donation checkout session does not belong to this account.",
        403,
      );
    }

    const status = checkoutStatus(session);
    if (status !== stored.status) {
      await this.supabase
        .from("donation_checkout_sessions")
        .update({ status })
        .eq("id", params.sessionId)
        .eq("account_id", params.accountId);
    }
    return { status };
  }
}

function createStripeClient() {
  const secretKey = getServerEnv().stripeSecretKey;
  if (!secretKey) {
    throw new ManagerError(
      "stripe_not_configured",
      "Missing required environment variable: STRIPE_SECRET_KEY",
      500,
    );
  }
  return new Stripe(secretKey);
}

function validateAmount(amount: number) {
  if (!Number.isSafeInteger(amount) || amount < 1 || amount > 10_000) {
    throw new ManagerError(
      "invalid_donation_amount",
      "Donation amount must be a whole USD amount between 1 and 10,000.",
      422,
    );
  }
}

function validateCheckoutUrl(value: string) {
  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol)) throw new Error();
    return url;
  } catch {
    throw new ManagerError(
      "invalid_checkout_url",
      "Checkout return URL is invalid.",
      422,
    );
  }
}

function checkoutStatus(
  session: Stripe.Checkout.Session,
): DonationCheckoutStatus {
  if (session.status === "complete" && session.payment_status === "paid") {
    return "success";
  }
  return session.status === "expired" || session.status === "open"
    ? "canceled"
    : "retryable-failure";
}

function toDonationCheckout(row: DonationRow): DonationCheckoutSessionDetail {
  return {
    object: "donation_checkout_session",
    id: row.id,
    accountId: row.account_id,
    amount: row.amount,
    currency: "usd",
    checkoutUrl: row.checkout_url,
    status: row.status as DonationCheckoutStatus,
    createdAt: new Date(row.created_date).getTime(),
    updatedAt: new Date(row.updated_date).getTime(),
  };
}
