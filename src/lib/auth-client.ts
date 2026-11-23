import { paddleClient } from "@paddle/better-auth/client";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({ plugins: [paddleClient()] });
