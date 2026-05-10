-- Per-user jobs: add user_id and lock down via RLS.
-- Run in Supabase SQL Editor or via Supabase CLI after placing this file under supabase/migrations.
--
-- BACKFILL (optional): Existing rows without user_id will NOT match policies that require
-- auth.uid() = user_id (and IS NOT DISTINCT FROM behaves the same — NULL misses ownership).
-- To assign legacy rows to a user, run something like:
--   UPDATE public.jobs SET user_id = '<your-user-uuid>'::uuid WHERE user_id IS NULL;

ALTER TABLE public.jobs
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users (id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS jobs_user_id_created_at_idx ON public.jobs (user_id, created_at DESC);

-- Optional once all rows belong to someone:
-- ALTER TABLE public.jobs ALTER COLUMN user_id SET NOT NULL;

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- BREAKING: Remove permissive anon policies if present, e.g.:
-- DROP POLICY IF EXISTS "Allow public read" ON public.jobs;
-- DROP POLICY IF EXISTS "Allow insert for anon" ON public.jobs;
-- (policy names vary — check Table editor → Roles → Policies in the dashboard.)

DROP POLICY IF EXISTS "Users select own jobs" ON public.jobs;
CREATE POLICY "Users select own jobs" ON public.jobs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own jobs" ON public.jobs;
CREATE POLICY "Users insert own jobs" ON public.jobs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own jobs" ON public.jobs;
CREATE POLICY "Users update own jobs" ON public.jobs
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own jobs" ON public.jobs;
CREATE POLICY "Users delete own jobs" ON public.jobs
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
