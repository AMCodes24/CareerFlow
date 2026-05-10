"use client";

import { useActionState, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { deleteJob, updateJob, type CreateJobResult } from "@/app/actions/jobs";
import type { JobRow } from "@/lib/jobs";
import { JOB_STATUS_OPTIONS } from "@/lib/job-status";

const initialState: CreateJobResult = {};

const inputClassName =
  "mt-1 w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-500/60 focus:outline-none focus:ring-2 focus:ring-cyan-500/30";

const btnPrimaryClassName =
  "rounded-lg bg-cyan-500/90 px-3 py-1.5 text-xs font-medium text-slate-950 transition-colors hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-cyan-400/70";

const btnMutedClassName =
  "rounded-lg border border-slate-600 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-slate-500 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-slate-500/40";

const btnDangerClassName =
  "rounded-lg border border-red-900/80 bg-red-950/50 px-3 py-1.5 text-xs font-medium text-red-200 transition-colors hover:bg-red-950/80 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-red-500/40";

function EditJobForm({
  job,
  onClose,
}: {
  job: JobRow;
  onClose: () => void;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(
    async (_prev: CreateJobResult, formData: FormData) => updateJob(formData),
    initialState,
  );

  useEffect(() => {
    if (!state.success) {
      return;
    }
    formRef.current?.reset();
    onClose();
    router.refresh();
  }, [state, onClose, router]);

  const defaultStatus =
    job.status &&
    JOB_STATUS_OPTIONS.some((o) => o.value === job.status)
      ? job.status
      : "applied";

  return (
    <form ref={formRef} action={action} className="space-y-3">
      <input type="hidden" name="id" value={String(job.id)} />
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="block text-xs text-slate-400">
          Company
          <input
            name="company"
            type="text"
            required
            autoComplete="organization"
            defaultValue={job.company ?? ""}
            className={inputClassName}
          />
        </label>
        <label className="block text-xs text-slate-400">
          Title
          <input
            name="title"
            type="text"
            required
            autoComplete="organization-title"
            defaultValue={job.title ?? ""}
            className={inputClassName}
          />
        </label>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="block text-xs text-slate-400">
          Status
          <select
            name="status"
            className={inputClassName}
            defaultValue={defaultStatus}
          >
            {JOB_STATUS_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs text-slate-400">
          Notes
          <input
            name="notes"
            type="text"
            className={inputClassName}
            placeholder="Optional"
            defaultValue={job.notes ?? ""}
          />
        </label>
      </div>
      {state?.error ? (
        <p className="text-xs text-red-400" role="alert">
          {state.error}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2 pt-1">
        <button
          type="submit"
          disabled={pending}
          className={btnPrimaryClassName}
        >
          {pending ? "Saving…" : "Save changes"}
        </button>
        <button type="button" onClick={onClose} className={btnMutedClassName}>
          Cancel
        </button>
      </div>
    </form>
  );
}

type RecentApplicationsListProps = {
  jobs: JobRow[];
};

export function RecentApplicationsList({ jobs }: RecentApplicationsListProps) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [editing, setEditing] = useState<JobRow | null>(null);

  const [deleteState, deleteAction, deletePending] = useActionState(
    async (_prev: CreateJobResult, formData: FormData) => deleteJob(formData),
    initialState,
  );

  const closeDialog = useCallback(() => {
    dialogRef.current?.close();
    setEditing(null);
  }, []);

  useEffect(() => {
    if (!deleteState.success) {
      return;
    }
    router.refresh();
  }, [deleteState, router]);

  function openEdit(job: JobRow) {
    setEditing(job);
    dialogRef.current?.showModal();
  }

  return (
    <>
      <ul className="mt-3 max-h-44 space-y-2 overflow-y-auto pr-1 text-sm text-slate-300">
        {jobs.map((job) => (
          <li
            key={String(job.id)}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-800/80 bg-slate-950/60 px-3 py-2"
          >
            <div className="min-w-0 flex-1">
              <span className="font-medium text-slate-100">
                {job.title ?? "—"}
                <span className="font-normal text-slate-500"> · </span>
                <span className="font-normal text-slate-300">{job.company ?? "—"}</span>
              </span>
              {job.status ? (
                <span className="ml-2 inline-flex rounded-md border border-slate-700 bg-slate-900 px-2 py-0.5 text-xs capitalize text-slate-300">
                  {job.status}
                </span>
              ) : null}
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                onClick={() => openEdit(job)}
                className={btnMutedClassName}
              >
                Edit
              </button>
              <form
                action={deleteAction}
                onSubmit={(e) => {
                  if (!window.confirm("Delete this application?")) {
                    e.preventDefault();
                  }
                }}
              >
                <input type="hidden" name="id" value={String(job.id)} />
                <button
                  type="submit"
                  disabled={deletePending}
                  className={btnDangerClassName}
                >
                  {deletePending ? "…" : "Delete"}
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>

      {deleteState?.error ? (
        <p className="mt-2 text-xs text-red-400" role="alert">
          {deleteState.error}
        </p>
      ) : null}

      <dialog
        ref={dialogRef}
        className="w-[min(100%,24rem)] rounded-xl border border-slate-800 bg-slate-950 p-5 text-slate-100 shadow-2xl backdrop:bg-black/70"
        onClose={() => setEditing(null)}
      >
        <div className="mb-4 flex items-center justify-between gap-2">
          <p className="text-xs font-medium text-slate-300">Edit application</p>
          <button
            type="button"
            onClick={closeDialog}
            className="rounded-md px-2 py-1 text-xs text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          >
            Close
          </button>
        </div>

        {editing ? (
          <EditJobForm
            key={String(editing.id)}
            job={editing}
            onClose={closeDialog}
          />
        ) : null}
      </dialog>
    </>
  );
}
