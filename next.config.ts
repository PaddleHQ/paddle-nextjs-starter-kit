import { existsSync } from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";
import "./src/env";

// Fail here with a fix rather than as a "module not found" deep inside the pricing page.
if (!existsSync(path.join(process.cwd(), "src/catalog/catalog.json"))) {
  throw new Error("src/catalog/catalog.json is missing. Run `pnpm seed` to create your plans in Paddle.");
}

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
