import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getSession } from "@/lib/session";
import "../login.css";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div>
      <Suspense fallback={null}>
        <RedirectIfSignedIn />
      </Suspense>
      <div className="login-background-base login-gradient-background min-h-screen md:min-h-[919px]" />
      <div className="login-background-base grain-background min-h-screen md:min-h-[919px]" />
      <div className="login-background-base grid-bg min-h-screen md:min-h-[919px]" />
      {children}
    </div>
  );
}

// A real session check, not the cookie test proxy.ts uses: a stale cookie would otherwise bounce between /login and /dashboard.
async function RedirectIfSignedIn() {
  if (await getSession()) redirect("/dashboard");
  return null;
}
