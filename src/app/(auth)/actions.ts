"use server";

import { APIError } from "better-auth/api";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import * as z from "zod";
import { auth } from "@/lib/auth";
import { safeCallbackURL } from "@/lib/callback-url";

export type AuthFormState = {
  error?: string;
  values?: { name?: string; email?: string };
};

const GENERIC_ERROR = "Something went wrong. Please try again";

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

function field(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function errorMessage(error: unknown): string {
  if (error instanceof APIError) {
    const code = error.body?.code;
    if (code && code in API_ERROR_MESSAGES) return API_ERROR_MESSAGES[code];
  }
  return GENERIC_ERROR;
}

export async function signUp(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const values = { name: field(formData, "name"), email: field(formData, "email") };
  const parsed = signUpSchema.safeParse({ ...values, password: field(formData, "password") });
  if (!parsed.success) return { error: parsed.error.issues[0].message, values };

  try {
    await auth.api.signUpEmail({ body: parsed.data, headers: await headers() });
  } catch (error) {
    return { error: errorMessage(error), values };
  }
  redirect(safeCallbackURL(formData.get("callbackURL")));
}

export async function signIn(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const values = { email: field(formData, "email") };
  const parsed = signInSchema.safeParse({ ...values, password: field(formData, "password") });
  if (!parsed.success) return { error: parsed.error.issues[0].message, values };

  try {
    await auth.api.signInEmail({ body: parsed.data, headers: await headers() });
  } catch (error) {
    return { error: errorMessage(error), values };
  }
  redirect(safeCallbackURL(formData.get("callbackURL")));
}

export async function signInWithGitHub(formData: FormData): Promise<void> {
  const { url } = await auth.api.signInSocial({
    body: { provider: "github", callbackURL: safeCallbackURL(formData.get("callbackURL")) },
    headers: await headers(),
  });
  if (!url) throw new Error("GitHub sign-in did not return a redirect URL");
  redirect(url);
}
