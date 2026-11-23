"use client";

import { useActionState } from "react";
import { signUp, type AuthFormState } from "@/app/(auth)/actions";
import { AuthField } from "@/components/auth/auth-field";
import { FormError } from "@/components/auth/form-error";
import { Button } from "@/components/ui/button";

export function SignupForm({ callbackURL }: { callbackURL?: string }) {
  const [state, formAction, pending] = useActionState<AuthFormState, FormData>(signUp, {});

  return (
    <form action={formAction} className="flex w-full flex-col items-center gap-6">
      {callbackURL && <input type="hidden" name="callbackURL" value={callbackURL} />}
      <AuthField id="name" label="Name" type="text" autoComplete="name" required defaultValue={state.values?.name} />
      <AuthField
        id="email"
        label="Email address"
        type="email"
        autoComplete="email"
        required
        defaultValue={state.values?.email}
      />
      <AuthField id="password" label="Password" type="password" autoComplete="new-password" minLength={8} required />
      <Button type="submit" variant="secondary" className="w-full" disabled={pending}>
        Sign up
      </Button>
      <FormError message={state.error} />
    </form>
  );
}
