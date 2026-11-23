import { Environment, LogLevel, Paddle } from "@paddle/paddle-node-sdk";
import { env } from "@/env";

export const paddleClient = new Paddle(env.PADDLE_API_KEY, {
  environment: Environment[env.NEXT_PUBLIC_PADDLE_ENV],
  logLevel: LogLevel.error,
});
