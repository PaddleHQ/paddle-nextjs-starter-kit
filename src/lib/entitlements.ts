import type { SubscriptionStatus } from "@paddle/paddle-node-sdk";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { user } from "@/db/schema";
import { findCatalogPrice, type Interval } from "@/lib/catalog";
import { paddle } from "@/lib/paddle";

export interface Entitlements {
  plan: { tierId: string; name: string; interval: Interval } | null;
  status: SubscriptionStatus | null;
  features: string[];
}

const NO_PLAN: Entitlements = { plan: null, status: null, features: [] };
const ACCESS_STATUSES: SubscriptionStatus[] = ["active", "trialing", "past_due"];

/**
 * What the user can access right now. Pages and actions call this instead of reading billing data directly.
 *
 * TEMPORARY (until DX-1467 lands): asks the Paddle API on every call. DX-1467 replaces the body with a read of the
 * webhook-synced subscription tables; the signature and return shape stay the same.
 */
export async function getEntitlements(userId: string): Promise<Entitlements> {
  const [row] = await db.select({ email: user.email }).from(user).where(eq(user.id, userId)).limit(1);
  if (!row) return NO_PLAN;

  const customers = await paddle.customers.list({ email: [row.email] }).next();
  if (customers.length === 0) return NO_PLAN;

  const subscriptions = await paddle.subscriptions
    .list({ customerId: customers.map((customer) => customer.id), status: ACCESS_STATUSES, perPage: 50 })
    .next();
  // Emails aren't verified, so only trust subscriptions our own checkout tagged with this user's ID.
  const subscription = subscriptions.find((candidate) => candidate.customData?.userId === userId);
  if (!subscription) return NO_PLAN;

  for (const item of subscription.items) {
    const match = findCatalogPrice(item.price.id);
    if (match) {
      return {
        plan: { tierId: match.tier.id, name: match.tier.name, interval: match.interval },
        status: subscription.status,
        features: match.tier.features,
      };
    }
  }
  return NO_PLAN;
}
