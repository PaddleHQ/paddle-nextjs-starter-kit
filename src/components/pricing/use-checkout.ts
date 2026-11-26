"use client";

import { useState, useTransition } from "react";
import { startCheckout } from "@/app/pricing/actions";
import type { PaddleState } from "@/components/paddle/use-paddle";

export function useCheckout(paddleState: PaddleState) {
  const [pendingPriceId, setPendingPriceId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function openCheckout(priceId: string) {
    if (paddleState.status !== "ready") return;
    const { paddle } = paddleState;
    setError(null);
    setPendingPriceId(priceId);

    startTransition(async () => {
      const result = await startCheckout(priceId);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      // Overlay is the default. For inline checkout, see docs/pricing-and-checkout.md.
      paddle.Checkout.open({
        transactionId: result.transactionId,
        customer: { email: result.email },
        settings: { successUrl: new URL("/checkout/success", window.location.origin).href },
      });
    });
  }

  return {
    ready: paddleState.status === "ready",
    unavailable: paddleState.status === "error",
    openCheckout,
    pendingPriceId: isPending ? pendingPriceId : null,
    error,
  };
}
