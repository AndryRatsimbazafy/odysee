"use client";

import { useActionState } from "react";
import { Button } from "@/components/admin/button";
import { Input } from "@/components/admin/input";
import { Label } from "@/components/admin/label";
import { signIn, type SignInState } from "@/lib/actions/auth";

type ErrorKey = NonNullable<SignInState>["error"];

type LoginFormProps = {
  labels: { email: string; password: string; submit: string; pending: string };
  errors: Record<ErrorKey, string>;
};

export function LoginForm({ labels, errors }: LoginFormProps) {
  const [state, action, pending] = useActionState(signIn, null);
  const error = state ? errors[state.error] : null;

  return (
    <form action={action} className="mt-8 grid gap-5" noValidate>
      <div className="grid gap-2">
        <Label htmlFor="email">{labels.email}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          defaultValue={state?.email}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "login-error" : undefined}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">{labels.password}</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "login-error" : undefined}
        />
      </div>
      <p
        id="login-error"
        aria-live="polite"
        className="min-h-6 text-sm text-destructive"
      >
        {error}
      </p>
      <Button type="submit" disabled={pending} className="justify-self-start">
        {pending ? labels.pending : labels.submit}
      </Button>
    </form>
  );
}
