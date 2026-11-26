"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

const POLL_INTERVAL_MS = 2000;
const MAX_ATTEMPTS = 30;

/** Re-renders the server page until entitlements show the new plan, then gives up after about a minute. */
export function WaitForPlan({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (attempts >= MAX_ATTEMPTS) return;
    const timer = setTimeout(() => {
      setAttempts((count) => count + 1);
      router.refresh();
    }, POLL_INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [attempts, router]);

  if (attempts < MAX_ATTEMPTS) return children;

  return (
    <>
      <h1 className="text-3xl font-medium">This is taking longer than usual</h1>
      <p className="text-muted-foreground" role="status">
        Your payment went through and you’ll get a receipt by email. Your plan should appear on your dashboard within a
        few minutes.
      </p>
      <Link href="/dashboard" className="text-sm underline underline-offset-4">
        Go to your dashboard
      </Link>
    </>
  );
}
