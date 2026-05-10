import { connection } from "next/server";

import { AddJobForm } from "@/components/add-job-form";
import { AuthHeader } from "@/components/auth-header";
import { CoverLetterAssistant } from "@/components/cover-letter-assistant";
import { RecentApplicationsList } from "@/components/recent-applications-list";
import { getPublicSupabaseConfig } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { jobDashboardMetrics, type JobRow } from "@/lib/jobs";

async function loadJobsForUser(userId: string): Promise<JobRow[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("jobs")
    .select("id, company, title, status, notes, created_at, user_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(
      "[jobs] query failed:",
      error.message,
      error.code ?? "",
      error.details ?? "",
      error.hint ?? "",
    );
    return [];
  }

  return (data as JobRow[]) ?? [];
}

export default async function HomePage() {
  await connection();
  const envReady = getPublicSupabaseConfig() !== null;
  const supabase = envReady ? await createServerSupabaseClient() : null;

  let userEmail: string | null = null;
  let jobs: JobRow[] = [];

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userEmail = user?.email ?? null;
    if (user) {
      jobs = await loadJobsForUser(user.id);
    }
  }

  const { tracked, interviews, responseRatePct } = jobDashboardMetrics(jobs);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-16 sm:px-8 sm:py-20">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-xs text-slate-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
            AI-powered career workflow
          </div>
          {envReady ? (
            <AuthHeader loggedInEmail={userEmail} />
          ) : (
            <p className="text-xs text-amber-200/90">
              Add Supabase env keys to enable sign-in.
            </p>
          )}
        </header>

        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              AI Job Tracker
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Track applications intelligently, monitor interview momentum, and generate personalized
              cover letters with AI so every opportunity gets a faster, more strategic follow-up.
            </p>

            <p className="text-sm text-slate-400">
              {userEmail
                ? "You're signed in — your applications are private to your account."
                : "Sign in to save applications to your account (per-user data + row-level security)."}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-2xl shadow-cyan-900/20 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-sm font-medium text-slate-200">Dashboard Preview</h2>
              <span className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-300">
                Live status
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs text-slate-400">Applied</p>
                <p className="mt-2 text-2xl font-semibold text-white">{tracked}</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs text-slate-400">Interviews</p>
                <p className="mt-2 text-2xl font-semibold text-white">{interviews}</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs text-slate-400">Response Rate</p>
                <p className="mt-2 text-2xl font-semibold text-emerald-300">
                  {tracked === 0 ? "—" : `${responseRatePct}%`}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs text-slate-400">Recent applications</p>
              {!envReady ? (
                <p className="mt-2 text-sm leading-relaxed text-amber-200/90">
                  Add{" "}
                  <code className="rounded bg-slate-900 px-1 py-0.5 text-[0.65rem] text-cyan-200">
                    NEXT_PUBLIC_SUPABASE_URL
                  </code>{" "}
                  and{" "}
                  <code className="rounded bg-slate-900 px-1 py-0.5 text-[0.65rem] text-cyan-200">
                    NEXT_PUBLIC_SUPABASE_ANON_KEY
                  </code>{" "}
                  to <span className="text-slate-200">.env.local</span>.
                </p>
              ) : !userEmail ? (
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  Sign in above to load and manage your applications.
                </p>
              ) : jobs.length === 0 ? (
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  No jobs yet — add one below.
                </p>
              ) : (
                <RecentApplicationsList jobs={jobs} />
              )}
            </div>

            {userEmail ? (
              <>
                <CoverLetterAssistant />
                <AddJobForm />
              </>
            ) : envReady ? (
              <p className="mt-5 border-t border-slate-800 pt-5 text-xs text-slate-500">
                Add-job form and cover letter tools appear after you sign in.
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
