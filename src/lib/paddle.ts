import { Environment, Paddle } from "@paddle/paddle-node-sdk";
import { env } from "@/env";

const globalForPaddle = globalThis as unknown as { paddle?: Paddle };

/** Server-only: holds the secret API key. Client code uses Paddle.js with the client-side token instead. */
export const paddle =
  globalForPaddle.paddle ?? new Paddle(env.PADDLE_API_KEY, { environment: Environment[env.NEXT_PUBLIC_PADDLE_ENV] });
if (process.env.NODE_ENV !== "production") globalForPaddle.paddle = paddle;
