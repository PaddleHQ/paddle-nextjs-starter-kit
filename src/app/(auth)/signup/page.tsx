import Link from "next/link";
import { Suspense } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { GitHubButton } from "@/components/auth/github-button";
import { SignupForm } from "@/components/auth/signup-form";
import { githubEnabled } from "@/lib/auth";
import { withCallback } from "@/lib/callback-url";

export default function SignupPage({ searchParams }: PageProps<"/signup">) {
  return (
    <Suspense fallback={<SignupCard />}>
      <SignupCardWithCallback searchParams={searchParams} />
    </Suspense>
  );
}

async function SignupCardWithCallback({ searchParams }: Pick<PageProps<"/signup">, "searchParams">) {
  const { callbackURL } = await searchParams;
  return <SignupCard callbackURL={typeof callbackURL === "string" ? callbackURL : undefined} />;
}

function SignupCard({ callbackURL }: { callbackURL?: string }) {
  return (
    <AuthCard
      title="Create an account"
      form={<SignupForm callbackURL={callbackURL} />}
      github={githubEnabled ? <GitHubButton label="Sign up with GitHub" callbackURL={callbackURL} /> : null}
      footer={
        <>
          Already have an account?{" "}
          <Link href={withCallback("/login", callbackURL)} className="text-white">
            Log in
          </Link>
        </>
      }
    />
  );
}
