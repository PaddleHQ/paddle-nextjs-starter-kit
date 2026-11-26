import * as z from "zod";
import catalogJSON from "@/catalog/catalog.json";
import { env } from "@/env";

export const intervals = ["month", "year"] as const;
export type Interval = (typeof intervals)[number];

const tierSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  features: z.array(z.string()),
  featured: z.boolean(),
  productId: z.string().startsWith("pro_"),
  prices: z.object({ month: z.string().startsWith("pri_"), year: z.string().startsWith("pri_") }),
});

const catalogSchema = z.object({
  environment: z.enum(["sandbox", "production"]),
  tiers: z.array(tierSchema).min(1),
});

export type Tier = z.infer<typeof tierSchema>;

function loadCatalog() {
  const parsed = catalogSchema.safeParse(catalogJSON);
  if (!parsed.success) {
    throw new Error(`src/catalog/catalog.json is invalid. Run \`pnpm seed\` to regenerate it.\n${z.prettifyError(parsed.error)}`);
  }
  // Sandbox and live price IDs look alike, and a mismatch only fails later inside checkout.
  if (!process.env.SKIP_ENV_VALIDATION && parsed.data.environment !== env.NEXT_PUBLIC_PADDLE_ENV) {
    throw new Error(
      `src/catalog/catalog.json was seeded for ${parsed.data.environment} but NEXT_PUBLIC_PADDLE_ENV is ${env.NEXT_PUBLIC_PADDLE_ENV}. Run \`pnpm seed\` again.`,
    );
  }
  return parsed.data;
}

export const catalog = loadCatalog();

/** The only way to turn a price ID from a request into a plan, so checkout can't be opened for anything else. */
export function findCatalogPrice(priceId: string): { tier: Tier; interval: Interval } | null {
  for (const tier of catalog.tiers) {
    for (const interval of intervals) {
      if (tier.prices[interval] === priceId) return { tier, interval };
    }
  }
  return null;
}
