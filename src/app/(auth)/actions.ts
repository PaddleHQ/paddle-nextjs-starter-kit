"use server";

import { parseSetCookieHeader, toCookieOptions } from "better-auth/cookies";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import * as z from "zod";
import { env } from "@/env";
import { auth } from "@/lib/auth";
import { safeCallbackURL } from "@/lib/callback-url";

export type AuthFormState = {
  error?: string;
  values?: { name?: string; email?: string };
};

const GENERIC_ERROR = "Something went wrong. Please try again";
const RATE_LIMITED_ERROR = "Too many attempts. Please wait a moment and try again";

const API_ERROR_MESSAGES: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: "Invalid email or password",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "An account with this email already exists",
};

const signUpSchema = z.object({
  name: z.string().trim().min(1, "Enter your name"),
  email: z.email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const signInSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});

type AuthResult = { ok: true; data: Record<string, unknown> | null } | { ok: false; error: string };

// Calls go through auth.handler rather than auth.api.* so Better Auth's router middleware runs:
// its sign-in/sign-up rate limits and its callbackURL origin check only apply there.
async function callAuth(path: string, body: Record<string, unknown>): Promise<AuthResult> {
  const requestHeaders = new Headers(await headers());
  requestHeaders.delete("content-length");
  requestHeaders.set("content-type", "application/json");

  const response = await auth.handler(
    new Request(new URL(`/api/auth${path}`, env.BETTER_AUTH_URL), {
      method: "POST",
      headers: requestHeaders,
      body: JSON.stringify(body),
    }),
  );
  const data = await response.json().catch(() => null);

  // nextCookies() skips router calls, so copy the handler's cookies (session, OAuth state) onto this response.
  const setCookie = response.headers.get("set-cookie");
  if (setCookie) {
    const cookieStore = await cookies();
    parseSetCookieHeader(setCookie).forEach((attributes, name) => {
      if (name) cookieStore.set(name, attributes.value, toCookieOptions(attributes));
    });
  }

  if (response.status === 429) return { ok: false, error: RATE_LIMITED_ERROR };
  if (!response.ok) return { ok: false, error: API_ERROR_MESSAGES[data?.code] ?? GENERIC_ERROR };
  return { ok: true, data };
}

function field(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export async function signUp(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const values = { name: field(formData, "name"), email: field(formData, "email") };
  const parsed = signUpSchema.safeParse({ ...values, password: field(formData, "password") });
  if (!parsed.success) return { error: parsed.error.issues[0].message, values };

  const result = await callAuth("/sign-up/email", parsed.data);
  if (!result.ok) return { error: result.error, values };
  redirect(safeCallbackURL(formData.get("callbackURL")));
}

export async function signIn(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const values = { email: field(formData, "email") };
  const parsed = signInSchema.safeParse({ ...values, password: field(formData, "password") });
  if (!parsed.success) return { error: parsed.error.issues[0].message, values };

  const result = await callAuth("/sign-in/email", parsed.data);
  if (!result.ok) return { error: result.error, values };
  redirect(safeCallbackURL(formData.get("callbackURL")));
}

export async function signOut(): Promise<void> {
  await auth.api.signOut({ headers: await headers() });
  redirect("/login");
}

export async function signInWithGitHub(formData: FormData): Promise<void> {
  const result = await callAuth("/sign-in/social", {
    provider: "github",
    callbackURL: safeCallbackURL(formData.get("callbackURL")),
  });
  const url = result.ok ? result.data?.url : undefined;
  if (typeof url !== "string") throw new Error("GitHub sign-in did not return a redirect URL");
  redirect(url);
}
