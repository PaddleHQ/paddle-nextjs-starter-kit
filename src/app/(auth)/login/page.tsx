import Link from "next/link";
import { Suspense } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { GitHubButton } from "@/components/auth/github-button";
import { LoginForm } from "@/components/auth/login-form";
import { githubEnabled } from "@/lib/auth";

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <Suspense fallback={<LoginCard />}>
      <LoginCardWithCallback searchParams={searchParams} />
    </Suspense>
  );
}

async function LoginCardWithCallback({ searchParams }: Pick<PageProps<"/login">, "searchParams">) {
  const { callbackURL } = await searchParams;
  return <LoginCard callbackURL={typeof callbackURL === "string" ? callbackURL : undefined} />;
}

function LoginCard({ callbackURL }: { callbackURL?: string }) {
  return (
    <AuthCard
      title="Log in to your account"
      form={<LoginForm callbackURL={callbackURL} />}
      github={githubEnabled ? <GitHubButton label="Log in with GitHub" callbackURL={callbackURL} /> : null}
      footer={
        <>
          Don’t have an account?{" "}
          <Link href="/signup" className="text-white">
            Sign up
          </Link>
        </>
      }
    />
  );
}
