"use client";

import { CheckoutEventNames, initializePaddle, type Paddle, type PaddleEventData } from "@paddle/paddle-js";
import { useEffect, useState } from "react";
import { env } from "@/env";

// Shared across components so Paddle.js is downloaded and initialised once per page load.
let paddlePromise: Promise<Paddle | undefined> | undefined;

function loadPaddle() {
  paddlePromise ??= initializePaddle({
    environment: env.NEXT_PUBLIC_PADDLE_ENV,
    token: env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
    checkout: { settings: { displayMode: "overlay", theme: "dark", variant: "one-page" } },
    eventCallback: lockScrollBehindOverlay,
  });
  return paddlePromise;
}

// Paddle's overlay doesn't stop the page behind it from scrolling.
function lockScrollBehindOverlay(event: PaddleEventData) {
  const root = document.documentElement;
  if (event.name === CheckoutEventNames.CHECKOUT_LOADED && event.data?.settings.display_mode !== "inline") {
    root.style.overflow = "hidden";
  } else if (event.name === CheckoutEventNames.CHECKOUT_CLOSED) {
    root.style.overflow = "";
  }
}

export type PaddleState = { status: "loading" } | { status: "ready"; paddle: Paddle } | { status: "error" };

export function usePaddle(): PaddleState {
  const [state, setState] = useState<PaddleState>({ status: "loading" });

  useEffect(() => {
    let active = true;
    loadPaddle()
      .then((paddle) => {
        if (active) setState(paddle ? { status: "ready", paddle } : { status: "error" });
      })
      .catch((error: unknown) => {
        console.error("Failed to load Paddle.js", error);
        if (active) setState({ status: "error" });
      });
    return () => {
      active = false;
    };
  }, []);

  return state;
}
