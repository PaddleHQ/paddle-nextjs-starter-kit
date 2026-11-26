"use client";

import type { PricePreviewParams } from "@paddle/paddle-js";
import { useEffect, useState } from "react";
import type { PaddleState } from "@/components/paddle/use-paddle";

export interface LocalisedPrice {
  /** What the visitor pays for their country, tax included, formatted in their currency, e.g. "€27.10". */
  total: string;
  /** Tax within `total`, e.g. "€4.33". Null when Paddle has no tax to add for the country. */
  tax: string | null;
  /** Pre-tax amount in the currency's smallest unit, used to work out the yearly saving. */
  subtotalMinor: number;
}

export type PricePreviewState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; prices: Record<string, LocalisedPrice>; countryCode: string | null };

/** `countryCode` null lets Paddle detect the visitor's country from their IP address. */
export function usePricePreview(paddleState: PaddleState, priceIds: string[], countryCode: string | null): PricePreviewState {
  const requestKey = `${priceIds.join(",")}|${countryCode ?? "auto"}`;
  const [result, setResult] = useState<{ key: string; state: PricePreviewState } | null>(null);

  useEffect(() => {
    if (paddleState.status !== "ready") return;
    let active = true;

    const params: PricePreviewParams = { items: priceIds.map((priceId) => ({ priceId, quantity: 1 })) };
    if (countryCode) params.address = { countryCode };

    paddleState.paddle
      .PricePreview(params)
      .then(({ data }) => {
        const prices: Record<string, LocalisedPrice> = {};
        for (const item of data.details.lineItems) {
          prices[item.price.id] = {
            total: item.formattedTotals.total,
            tax: Number(item.totals.tax) > 0 ? item.formattedTotals.tax : null,
            subtotalMinor: Number(item.totals.subtotal),
          };
        }
        if (active) {
          setResult({ key: requestKey, state: { status: "ready", prices, countryCode: data.address?.countryCode ?? null } });
        }
      })
      .catch((error: unknown) => {
        console.error("Paddle PricePreview failed", error);
        if (active) setResult({ key: requestKey, state: { status: "error" } });
      });

    return () => {
      active = false;
    };
    // requestKey captures priceIds and countryCode, so a new array with the same IDs doesn't refetch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paddleState, requestKey]);

  if (paddleState.status === "error") return { status: "error" };
  // Show loading while a new country or price set is being fetched, not the previous country's prices.
  return result?.key === requestKey ? result.state : { status: "loading" };
}
