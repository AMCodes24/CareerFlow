"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  signInWithPassword,
  signOut,
  signUpWithPassword,
  type AuthFormState,
} from "@/app/actions/auth";

const idle: AuthFormState = {};

export function AuthHeader({
  loggedInEmail,
}: {
  loggedInEmail: string | null;
}) {
  const router = useRouter();
  const [signInState, signInAction, signInPending] = useActionState(
    signInWithPassword,
    idle,
  );
  const [signUpState, signUpAction, signUpPending] = useActionState(
    signUpWithPassword,
    idle,
  );

  useEffect(() => {
    if (signInState && "success" in signInState && signInState.success) {
      router.refresh();
    }
  }, [signInState, router]);

  useEffect(() => {
    if (signUpState && "success" in signUpState && signUpState.success) {
      router.refresh();
    }
  }, [signUpState, router]);

  if (!loggedInEmail) {
    return (
      <div className="flex min-w-0 flex-1 flex-col items-stretch gap-2 sm:max-w-xl sm:items-end">
        <form className="flex min-w-0 flex-wrap items-end gap-2 sm:justify-end">
          <label className="min-w-[140px] flex-1 text-[0.65rem] text-slate-400">
            Email
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-0.5 w-full rounded-lg border border-slate-700 bg-slate-950/80 px-2.5 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-cyan-500/60 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
              placeholder="you@company.com"
            />
          </label>
          <label className="min-w-[120px] flex-1 text-[0.65rem] text-slate-400">
            Password
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-0.5 w-full rounded-lg border border-slate-700 bg-slate-950/80 px-2.5 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-cyan-500/60 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
              placeholder="••••••••"
            />
          </label>
          <button
            type="submit"
            formAction={signInAction}
            disabled={signInPending || signUpPending}
            className="shrink-0 rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-medium text-slate-950 transition-colors hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-cyan-400/70"
          >
            {signInPending ? "Signing in…" : "Sign in"}
          </button>
          <button
            type="submit"
            formAction={signUpAction}
            disabled={signInPending || signUpPending}
            className="shrink-0 rounded-lg border border-slate-600 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-slate-500 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-slate-500/50"
          >
            {signUpPending ? "Creating…" : "Create account"}
          </button>
        </form>
        <div className="w-full space-y-1 text-right">
          {"error" in signInState && signInState.error ? (
            <p className="text-[0.65rem] leading-snug text-red-400">
              Sign in: {signInState.error}
            </p>
          ) : null}
          {"error" in signUpState && signUpState.error ? (
            <p className="text-[0.65rem] leading-snug text-red-400">
              Sign up: {signUpState.error}
            </p>
          ) : null}
          {"message" in signUpState && signUpState.message ? (
            <p className="ml-auto max-w-sm text-[0.65rem] leading-snug text-amber-200/90">
              {signUpState.message}
            </p>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-2 text-xs">
      <span className="truncate text-slate-400" title={loggedInEmail}>
        {loggedInEmail}
      </span>
      <form action={signOut}>
        <button
          type="submit"
          className="rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 font-medium text-slate-200 transition-colors hover:border-slate-600 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500/50"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}
