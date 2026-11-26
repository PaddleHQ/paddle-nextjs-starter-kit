"use server";

import { redirect } from "next/navigation";
import { findCatalogPrice } from "@/lib/catalog";
import { paddle } from "@/lib/paddle";
import { getSession } from "@/lib/session";

export type StartCheckoutResult = { transactionId: string; email: string } | { error: string };

/**
 * Creates the transaction on the server so the client can't change the price or the user it's linked to.
 * Signed-out visitors are sent to sign up, then back to /pricing, which reopens checkout for the same price.
 */
export async function startCheckout(priceId: string): Promise<StartCheckoutResult> {
  if (typeof priceId !== "string" || !findCatalogPrice(priceId)) {
    return { error: "That plan isn't available. Refresh the page and try again" };
  }

  const session = await getSession();
  if (!session) {
    const returnTo = `/pricing?${new URLSearchParams({ checkout: priceId })}`;
    redirect(`/signup?${new URLSearchParams({ callbackURL: returnTo })}`);
  }

  try {
    const transaction = await paddle.transactions.create({
      items: [{ priceId, quantity: 1 }],
      // Copied to the subscription, so webhooks and entitlements can tie it back to this user.
      customData: { userId: session.user.id },
    });
    return { transactionId: transaction.id, email: session.user.email };
  } catch (error) {
    console.error("Failed to create Paddle transaction", error);
    return { error: "We couldn't start checkout. Please try again" };
  }
}
