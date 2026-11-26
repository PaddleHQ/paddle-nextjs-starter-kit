import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { WaitForPlan } from "@/components/checkout/wait-for-plan";
import { Button } from "@/components/ui/button";
import { getEntitlements } from "@/lib/entitlements";
import { requireSession } from "@/lib/session";

export const metadata: Metadata = { title: "Thanks for subscribing | AeroEdit" };

export default function CheckoutSuccessPage() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-col items-center gap-6 px-4 py-24 text-center">
      <Suspense fallback={<FinishingUp />}>
        <PlanStatus />
      </Suspense>
    </main>
  );
}

async function PlanStatus() {
  const { user } = await requireSession();
  const { plan } = await getEntitlements(user.id);

  // Paddle redirects here as soon as payment succeeds, usually a few seconds before the webhook that activates the plan.
  if (!plan) {
    return (
      <WaitForPlan>
        <FinishingUp />
      </WaitForPlan>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-medium">You’re on {plan.name}</h1>
      <p className="text-muted-foreground">
        Your {plan.interval === "year" ? "yearly" : "monthly"} subscription is active. A receipt is on its way to {user.email}.
      </p>
      <Button asChild>
        <Link href="/dashboard">Go to your dashboard</Link>
      </Button>
    </>
  );
}

function FinishingUp() {
  return (
    <>
      <h1 className="text-3xl font-medium">Finishing up…</h1>
      <p className="text-muted-foreground" role="status">
        Payment received. We’re activating your plan, which usually takes a few seconds.
      </p>
    </>
  );
}
