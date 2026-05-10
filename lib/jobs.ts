/** Loose row shape — Supabase columns may include extra fields. */
export type JobRow = {
  id: unknown;
  company: string | null;
  title: string | null;
  status: string | null;
  notes: string | null;
  created_at?: string | null;
};

function norm(value: string | null | undefined) {
  return (value ?? "").toLowerCase();
}

export function isInterviewStatus(status: string | null | undefined) {
  const s = norm(status);
  return s.includes("interview");
}

/** Dashboard KPIs derived from tracked jobs */
export function jobDashboardMetrics(jobs: JobRow[]) {
  const tracked = jobs.length;
  const interviews = jobs.filter((j) => isInterviewStatus(j.status)).length;
  const appliedForRate = tracked > 0 ? tracked : 1;
  const responseRatePct = Math.round((interviews / appliedForRate) * 100);

  return {
    tracked,
    interviews,
    responseRatePct,
  };
}
