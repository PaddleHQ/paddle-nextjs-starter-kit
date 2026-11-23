import { Suspense } from "react";
import { signOut } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { requireSession } from "@/lib/session";

export default function DashboardPage() {
  return (
    <main className="flex flex-col items-start gap-4 p-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <Suspense fallback={<p>Loading…</p>}>
        <SignedInAs />
      </Suspense>
      <form action={signOut}>
        <Button type="submit" variant="secondary">
          Log out
        </Button>
      </form>
    </main>
  );
}

async function SignedInAs() {
  const { user } = await requireSession();
  return <p>Signed in as {user.email}</p>;
}
