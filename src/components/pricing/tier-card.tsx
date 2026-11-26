import { cn } from "cn";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Interval, Tier } from "@/lib/catalog";
import type { LocalisedPrice } from "./use-price-preview";

interface Props {
  tier: Tier;
  interval: Interval;
  price: LocalisedPrice | "loading" | "error";
  yearlySaving: number;
  buttonState: "ready" | "pending" | "disabled";
  onSelect: () => void;
}

export function TierCard({ tier, interval, price, yearlySaving, buttonState, onSelect }: Props) {
  return (
    <article
      className={cn(
        "flex flex-col gap-6 rounded-lg border bg-background/80 p-8 backdrop-blur-[6px]",
        tier.featured ? "border-[#fff480]/60" : "border-border",
      )}
    >
      <header className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-xl font-medium">{tier.name}</h2>
          {tier.featured && (
            <span className="rounded-full bg-[#fff480] px-2 py-0.5 text-xs font-medium text-black">Most popular</span>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{tier.description}</p>
      </header>

      <PriceBlock price={price} interval={interval} yearlySaving={yearlySaving} />

      <Button
        variant={tier.featured ? "default" : "secondary"}
        className="w-full"
        disabled={buttonState !== "ready"}
        onClick={onSelect}
      >
        {buttonState === "pending" ? "Opening checkout…" : "Get started"}
      </Button>

      <ul className="flex flex-col gap-3 text-sm">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <Check aria-hidden className="mt-0.5 size-4 text-[#fff480]" />
            {feature}
          </li>
        ))}
      </ul>
    </article>
  );
}

function PriceBlock({ price, interval, yearlySaving }: Pick<Props, "price" | "interval" | "yearlySaving">) {
  if (price === "loading") {
    return (
      <div className="flex h-[72px] flex-col justify-center gap-2" aria-busy="true" aria-label="Loading price">
        <span className="h-9 w-32 animate-pulse rounded bg-muted" />
        <span className="h-4 w-40 animate-pulse rounded bg-muted" />
      </div>
    );
  }
  if (price === "error") {
    return <p className="flex h-[72px] items-center text-sm text-muted-foreground">Price unavailable right now</p>;
  }

  return (
    <div className="flex h-[72px] flex-col justify-center gap-1">
      <p className="flex items-baseline gap-1">
        <span className="text-4xl font-medium tracking-tight">{price.total}</span>
        <span className="text-muted-foreground">/{interval}</span>
        {interval === "year" && yearlySaving > 0 && (
          <span className="ml-2 rounded-full border border-[#fff480]/60 px-2 py-0.5 text-xs text-[#fff480]">
            Save {yearlySaving}%
          </span>
        )}
      </p>
      <p className="text-sm text-muted-foreground">
        {/* Without a postcode Paddle can't work out US sales tax, so zero tax doesn't mean tax-free. */}
        {price.tax ? `Includes ${price.tax} tax` : "Plus tax where applicable"}
      </p>
    </div>
  );
}
