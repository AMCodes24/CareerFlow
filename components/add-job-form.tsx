"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { createJob, type CreateJobResult } from "@/app/actions/jobs";

const initialState: CreateJobResult = {};

export function AddJobForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(
    async (_prevState: CreateJobResult, formData: FormData) => createJob(formData),
    initialState,
  );

  useEffect(() => {
    if (!state.success) {
      return;
    }
    formRef.current?.reset();
    router.refresh();
  }, [state, router]);

  return (
    <form
      ref={formRef}
      action={action}
      className="mt-5 space-y-3 border-t border-slate-800 pt-5"
    >
      <p className="text-xs font-medium text-slate-300">Add application</p>
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="block text-xs text-slate-400">
          Company
          <input
            name="company"
            type="text"
            required
            autoComplete="organization"
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-500/60 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
            placeholder="Acme Corp"
          />
        </label>
        <label className="block text-xs text-slate-400">
          Title
          <input
            name="title"
            type="text"
            required
            autoComplete="organization-title"
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-500/60 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
            placeholder="Software Engineer"
          />
        </label>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="block text-xs text-slate-400">
          Status
          <select
            name="status"
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 focus:border-cyan-500/60 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
            defaultValue="applied"
          >
            <option value="applied">Applied</option>
            <option value="screening">Screening</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
          </select>
        </label>
        <label className="block text-xs text-slate-400">
          Notes
          <input
            name="notes"
            type="text"
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-500/60 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
            placeholder="Optional"
          />
        </label>
      </div>
      {state?.error ? (
        <p className="text-xs text-red-400" role="alert">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-cyan-500/90 px-4 py-2 text-xs font-medium text-slate-950 transition-colors hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-cyan-400/70"
      >
        {pending ? "Saving…" : "Add job"}
      </button>
    </form>
  );
}
