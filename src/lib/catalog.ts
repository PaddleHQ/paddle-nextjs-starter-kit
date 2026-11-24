import type { PaddlePlan } from "@paddle/better-auth";

export type TierId = "starter" | "pro" | "advanced";

export interface Tier {
  id: TierId;
  name: string;
  description: string;
  features: string[];
  featured: boolean;
  prices: { month: string; year: string };
}

// Placeholder price IDs are replaced by the seed command once it exists; Pro points at the sandbox AeroEdit Pro prices.
export const tiers: Tier[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Ideal for individuals who want to get started with simple design tasks.",
    features: ["1 workspace", "Limited collaboration", "Export to PNG and SVG"],
    featured: false,
    prices: { month: "pri_replace_me_starter_month", year: "pri_replace_me_starter_year" },
  },
  {
    id: "pro",
    name: "Pro",
    description: "Enhanced design tools for scaling teams who need more flexibility.",
    features: ["Integrations", "Unlimited workspaces", "Advanced editing tools", "Everything in Starter"],
    featured: true,
    prices: { month: "pri_01m84aqe3mrqazv9sbhe776fhe", year: "pri_01m84aqvphjqzwa3nsqt3rqjb9" },
  },
  {
    id: "advanced",
    name: "Advanced",
    description: "Powerful tools designed for extensive collaboration and customization.",
    features: [
      "Single sign on (SSO)",
      "Advanced version control",
      "Assets library",
      "Guest accounts",
      "Everything in Pro",
    ],
    featured: false,
    prices: { month: "pri_replace_me_advanced_month", year: "pri_replace_me_advanced_year" },
  },
];

export const plans: PaddlePlan[] = tiers.map((tier) => ({
  name: tier.id,
  priceId: tier.prices.month,
  annualPriceId: tier.prices.year,
}));
