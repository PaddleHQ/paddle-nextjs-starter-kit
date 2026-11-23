import { Suspense } from "react";
import { requireSession } from "@/lib/session";

export default function DashboardPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <Suspense fallback={<p>Loading…</p>}>
        <SignedInAs />
      </Suspense>
    </main>
  );
}

async function SignedInAs() {
  const { user } = await requireSession();
  return <p>Signed in as {user.email}</p>;
}
