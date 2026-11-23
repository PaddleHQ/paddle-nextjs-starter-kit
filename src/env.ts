import { createEnv } from "@t3-oss/env-nextjs";
import * as z from "zod";

const paddleKeyPrefixes = {
  sandbox: { apiKey: "pdl_sdbx_apikey_", clientToken: "test_" },
  production: { apiKey: "pdl_live_apikey_", clientToken: "live_" },
} as const;

export const env = createEnv({
  server: {
    DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),
    PADDLE_API_KEY: z
      .string()
      .regex(/^pdl_(sdbx|live)_apikey_/, "Must be a Paddle API key (pdl_sdbx_apikey_… or pdl_live_apikey_…)"),
    PADDLE_NOTIFICATION_WEBHOOK_SECRET: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(32, "Must be at least 32 characters"),
    BETTER_AUTH_URL: z.url({ protocol: /^https?$/ }),
    GITHUB_CLIENT_ID: z.string().optional(),
    GITHUB_CLIENT_SECRET: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_PADDLE_ENV: z.enum(["sandbox", "production"]),
    NEXT_PUBLIC_PADDLE_CLIENT_TOKEN: z
      .string()
      .regex(/^(test|live)_/, "Must be a Paddle client-side token (test_… or live_…)"),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_PADDLE_ENV: process.env.NEXT_PUBLIC_PADDLE_ENV,
    NEXT_PUBLIC_PADDLE_CLIENT_TOKEN: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
  },
  // Sandbox and live credentials look alike, and mixing them only fails later as a 401 from Paddle.
  createFinalSchema: (shape, isServer) =>
    z.object(shape).superRefine((vars, ctx) => {
      const expected = paddleKeyPrefixes[vars.NEXT_PUBLIC_PADDLE_ENV];
      if (!vars.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN.startsWith(expected.clientToken)) {
        ctx.addIssue({
          code: "custom",
          path: ["NEXT_PUBLIC_PADDLE_CLIENT_TOKEN"],
          message: `Must start with ${expected.clientToken} when NEXT_PUBLIC_PADDLE_ENV is ${vars.NEXT_PUBLIC_PADDLE_ENV}`,
        });
      }
      if (isServer && !vars.PADDLE_API_KEY.startsWith(expected.apiKey)) {
        ctx.addIssue({
          code: "custom",
          path: ["PADDLE_API_KEY"],
          message: `Must start with ${expected.apiKey} when NEXT_PUBLIC_PADDLE_ENV is ${vars.NEXT_PUBLIC_PADDLE_ENV}`,
        });
      }
      if (isServer && !vars.GITHUB_CLIENT_ID !== !vars.GITHUB_CLIENT_SECRET) {
        ctx.addIssue({
          code: "custom",
          path: [vars.GITHUB_CLIENT_ID ? "GITHUB_CLIENT_SECRET" : "GITHUB_CLIENT_ID"],
          message: "Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET together, or leave both empty",
        });
      }
    }),
  // Lets Docker and CI builds run without real secrets. Runtime still needs them.
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
