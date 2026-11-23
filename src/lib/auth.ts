import { paddle } from "@paddle/better-auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { env } from "@/env";
import { plans } from "@/lib/catalog";
import { paddleClient } from "@/lib/paddle";

export const githubEnabled = Boolean(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET);

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: { enabled: true },
  socialProviders: githubEnabled
    ? { github: { clientId: env.GITHUB_CLIENT_ID!, clientSecret: env.GITHUB_CLIENT_SECRET! } }
    : {},
  plugins: [
    paddle({
      paddleClient,
      webhookSecret: env.PADDLE_NOTIFICATION_WEBHOOK_SECRET,
      checkoutPage: "/checkout",
      subscription: { enabled: true, plans },
    }),
    // Must stay last: it sets cookies from server actions after the other plugins run.
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
