// `pnpm seed`: creates the plans below in Paddle and writes their IDs to src/catalog/catalog.json.
// Re-runs reuse matching products and prices, so it's safe to run again after editing a plan.

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import nextEnv from "@next/env";
import { Environment, Paddle } from "@paddle/paddle-node-sdk";
import type { CountryCode, Price, Product } from "@paddle/paddle-node-sdk";

type Interval = "month" | "year";
type Amounts = Record<"USD" | LocalCurrency, string>;

interface TierDefinition {
  id: string;
  name: string;
  description: string;
  features: string[];
  featured?: boolean;
  /** In the smallest currency unit, e.g. cents. USD is the base price; the others are fixed local prices. */
  amounts: Record<Interval, Amounts>;
}

// Fixed local prices rather than Paddle's automatic currency conversion, which not every account has.
// Countries not listed here pay the USD base price.
type LocalCurrency = "GBP" | "EUR";
const LOCAL_MARKETS: { currency: LocalCurrency; countries: CountryCode[] }[] = [
  { currency: "GBP", countries: ["GB"] },
  {
    currency: "EUR",
    countries: ["AT", "BE", "CY", "DE", "EE", "ES", "FI", "FR", "GR", "HR", "IE", "IT", "LT", "LU", "LV", "MT", "NL", "PT", "SI", "SK"],
  },
];

// Edit these to change your plans, then run `pnpm seed` again.
const TIERS: TierDefinition[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Ideal for individuals who want to get started with simple design tasks.",
    features: ["1 workspace", "Limited collaboration", "Export to PNG and SVG"],
    amounts: {
      month: { USD: "1000", GBP: "800", EUR: "900" },
      year: { USD: "10000", GBP: "8000", EUR: "9000" },
    },
  },
  {
    id: "pro",
    name: "Pro",
    description: "Enhanced design tools for scaling teams who need more flexibility.",
    features: ["Everything in Starter", "Unlimited workspaces", "Advanced editing tools", "Integrations"],
    featured: true,
    amounts: {
      month: { USD: "3000", GBP: "2400", EUR: "2800" },
      year: { USD: "30000", GBP: "24000", EUR: "28000" },
    },
  },
  {
    id: "advanced",
    name: "Advanced",
    description: "Powerful tools designed for extensive collaboration and customization.",
    features: ["Everything in Pro", "Single sign on (SSO)", "Advanced version control", "Assets library", "Guest accounts"],
    amounts: {
      month: { USD: "6000", GBP: "4800", EUR: "5500" },
      year: { USD: "60000", GBP: "48000", EUR: "55000" },
    },
  },
];

const TIER_KEY = "starter_kit_tier";
const OUTPUT = resolve(import.meta.dirname, "../src/catalog/catalog.json");

nextEnv.loadEnvConfig(process.cwd());

const apiKey = process.env.PADDLE_API_KEY;
const environment = process.env.NEXT_PUBLIC_PADDLE_ENV;
if (!apiKey || (environment !== "sandbox" && environment !== "production")) {
  console.error("Set PADDLE_API_KEY and NEXT_PUBLIC_PADDLE_ENV in .env.local before seeding.");
  process.exit(1);
}

const paddle = new Paddle(apiKey, { environment: Environment[environment] });

async function listAll<T>(collection: { hasMore: boolean; next(): Promise<T[]> }): Promise<T[]> {
  const items: T[] = [];
  do items.push(...(await collection.next()));
  while (collection.hasMore);
  return items;
}

async function upsertProduct(tier: TierDefinition, existing: Product[]): Promise<Product> {
  const match = existing.find((product) => product.customData?.[TIER_KEY] === tier.id);
  const fields = { name: tier.name, description: tier.description };
  if (!match) {
    console.log(`  creating product ${tier.name}`);
    return paddle.products.create({ ...fields, taxCategory: "standard", customData: { [TIER_KEY]: tier.id } });
  }
  if (match.name !== tier.name || match.description !== tier.description) {
    console.log(`  updating product ${tier.name}`);
    return paddle.products.update(match.id, fields);
  }
  return match;
}

function overridesFor(amounts: Amounts) {
  return LOCAL_MARKETS.map(({ currency, countries }) => ({
    countryCodes: countries,
    unitPrice: { amount: amounts[currency], currencyCode: currency },
  }));
}

function sameOverrides(price: Price, wanted: ReturnType<typeof overridesFor>): boolean {
  const key = (overrides: { countryCodes: string[]; unitPrice: { amount: string; currencyCode: string } }[]) =>
    overrides
      .map((o) => `${[...o.countryCodes].sort().join(",")}:${o.unitPrice.amount}${o.unitPrice.currencyCode}`)
      .sort()
      .join("|");
  return key(price.unitPriceOverrides) === key(wanted);
}

async function upsertPrice(tier: TierDefinition, productId: string, interval: Interval, existing: Price[]): Promise<Price> {
  const amounts = tier.amounts[interval];
  const unitPriceOverrides = overridesFor(amounts);
  const match = existing.find(
    (price) =>
      price.billingCycle?.interval === interval &&
      price.billingCycle.frequency === 1 &&
      price.unitPrice.amount === amounts.USD &&
      price.unitPrice.currencyCode === "USD",
  );

  if (match) {
    if (sameOverrides(match, unitPriceOverrides)) return match;
    console.log(`  updating local prices for ${tier.name} ${interval}ly`);
    return paddle.prices.update(match.id, { unitPriceOverrides });
  }

  // Changing the USD amount creates a new price instead of editing the old one, so existing subscribers keep theirs.
  console.log(`  creating ${interval}ly price for ${tier.name}`);
  return paddle.prices.create({
    productId,
    description: `${tier.name} ${interval}ly`,
    unitPrice: { amount: amounts.USD, currencyCode: "USD" },
    unitPriceOverrides,
    billingCycle: { interval, frequency: 1 },
  });
}

async function main() {
  console.log(`Seeding the Paddle ${environment} catalog…`);
  const products = await listAll(paddle.products.list({ status: ["active"], perPage: 200 }));

  const tiers = [];
  for (const tier of TIERS) {
    const product = await upsertProduct(tier, products);
    const prices = await listAll(paddle.prices.list({ productId: [product.id], status: ["active"], perPage: 200 }));
    const month = await upsertPrice(tier, product.id, "month", prices);
    const year = await upsertPrice(tier, product.id, "year", prices);
    tiers.push({
      id: tier.id,
      name: tier.name,
      description: tier.description,
      features: tier.features,
      featured: tier.featured ?? false,
      productId: product.id,
      prices: { month: month.id, year: year.id },
    });
  }

  mkdirSync(dirname(OUTPUT), { recursive: true });
  writeFileSync(OUTPUT, `${JSON.stringify({ environment, tiers }, null, 2)}\n`);
  console.log(`Wrote ${tiers.length} tiers to ${OUTPUT}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
