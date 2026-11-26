"use client";

import { useState } from "react";
import { usePaddle } from "@/components/paddle/use-paddle";
import type { Interval, Tier } from "@/lib/catalog";
import { BillingToggle, CountrySelect } from "./pricing-controls";
import { TierCard } from "./tier-card";
import { useCheckout } from "./use-checkout";
import { usePricePreview, type LocalisedPrice } from "./use-price-preview";

export function PricingTable({ tiers }: { tiers: Tier[] }) {
  const [interval, setInterval] = useState<Interval>("month");
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const paddleState = usePaddle();
  const checkout = useCheckout(paddleState);
  const preview = usePricePreview(
    paddleState,
    tiers.flatMap((tier) => [tier.prices.month, tier.prices.year]),
    countryCode,
  );

  const priceFor = (priceId: string): LocalisedPrice | "loading" | "error" => {
    if (preview.status !== "ready") return preview.status;
    return preview.prices[priceId] ?? "error";
  };
  const savings = new Map(
    tiers.map((tier) => [tier.id, yearlySaving(priceFor(tier.prices.month), priceFor(tier.prices.year))]),
  );
  const maxSaving = Math.max(0, ...savings.values());

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
        <BillingToggle value={interval} onChange={setInterval} maxSaving={maxSaving} />
        <CountrySelect
          value={countryCode}
          detected={preview.status === "ready" && !countryCode ? preview.countryCode : null}
          onChange={setCountryCode}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {tiers.map((tier) => {
          const priceId = tier.prices[interval];
          return (
            <TierCard
              key={tier.id}
              tier={tier}
              interval={interval}
              price={priceFor(priceId)}
              yearlySaving={savings.get(tier.id) ?? 0}
              buttonState={
                checkout.pendingPriceId === priceId
                  ? "pending"
                  : checkout.ready && !checkout.pendingPriceId
                    ? "ready"
                    : "disabled"
              }
              onSelect={() => checkout.openCheckout(priceId)}
            />
          );
        })}
      </div>

      {(checkout.error || checkout.unavailable) && (
        <p role="alert" className="text-center text-sm text-destructive-foreground">
          {checkout.error ?? "Checkout couldn't load. Check your connection and refresh the page"}
        </p>
      )}
    </div>
  );
}

function yearlySaving(month: LocalisedPrice | string, year: LocalisedPrice | string): number {
  if (typeof month === "string" || typeof year === "string" || month.subtotalMinor <= 0) return 0;
  return Math.max(0, Math.round((1 - year.subtotalMinor / (month.subtotalMinor * 12)) * 100));
}
