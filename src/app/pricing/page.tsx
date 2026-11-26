import type { Metadata } from "next";
import { Suspense } from "react";
import { PricingTable } from "@/components/pricing/pricing-table";
import { ResumeCheckout } from "@/components/pricing/resume-checkout";
import { catalog } from "@/lib/catalog";

export const metadata: Metadata = { title: "Pricing | AeroEdit" };

export default function PricingPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16 md:px-8 md:py-24">
      <header className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-[40px] leading-[48px] font-medium tracking-[-0.8px] md:text-[56px] md:leading-[64px]">
          Simple pricing for every team
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Start with the plan that fits today and switch as you grow. Prices are shown in your local currency.
        </p>
      </header>

      {/* Reads the URL, so it can't be part of the prerendered page. */}
      <Suspense fallback={null}>
        <ResumeCheckout />
      </Suspense>

      <PricingTable tiers={catalog.tiers} />
    </main>
  );
}
