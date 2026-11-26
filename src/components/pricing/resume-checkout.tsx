"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { usePaddle } from "@/components/paddle/use-paddle";
import { useCheckout } from "./use-checkout";

/** Reopens checkout after sign-up: startCheckout sends signed-out visitors back to /pricing?checkout=<priceId>. */
export function ResumeCheckout() {
  const priceId = useSearchParams().get("checkout");
  const router = useRouter();
  const checkout = useCheckout(usePaddle());
  const started = useRef(false);

  useEffect(() => {
    if (!priceId || !checkout.ready || started.current) return;
    started.current = true;
    // Drop the param so a refresh or back navigation doesn't open checkout again.
    router.replace("/pricing", { scroll: false });
    checkout.openCheckout(priceId);
  }, [priceId, checkout, router]);

  if (!checkout.error) return null;
  return (
    <p role="alert" className="text-center text-sm text-destructive-foreground">
      {checkout.error}
    </p>
  );
}
