# CareerFlow

CareerFlow is a professional job search management platform for tracking applications, interviews, follow-ups, and overall career pipeline progress.

**Portfolio summary:** Built a production-ready full-stack Next.js application with secure Supabase authentication, row-level data protection, workflow-oriented CRUD operations, and analytics-driven dashboard metrics.

**Repository:** [github.com/AMCodes24/careerflow](https://github.com/AMCodes24/careerflow)

## Project Overview

CareerFlow gives job seekers one centralized workspace to run their search like a process:
- Track opportunities from application to offer
- Maintain context with notes and status history
- Monitor momentum with lightweight analytics
- Automate repetitive writing tasks with Cover Letter Studio

## Problem It Solves

Most job searches are managed across fragmented tools (notes apps, spreadsheets, email threads). CareerFlow consolidates this into a single system that improves visibility, consistency, and follow-through.

## Key Features

- **Job tracking & application management:** create, update, and delete job records
- **Interview tracking:** capture interview-stage progression via status updates
- **Workflow automation:** generate role-tailored cover letters through a secure server route
- **Analytics:** dashboard cards for tracked applications, interview count, and response rate
- **Secure user accounts:** email/password authentication with session persistence
- **Data isolation:** each user only sees their own records via ownership checks + RLS
- **Responsive interface:** modern, mobile-friendly UI built with Tailwind CSS

## Architecture Overview

CareerFlow uses a Next.js App Router architecture with clear responsibility boundaries:

- **Frontend (React components):** forms, lists, dashboard cards, and user interactions
- **Backend (Next.js server actions + route handler):**
  - `app/actions/auth.ts` handles sign-in/sign-up/sign-out
  - `app/actions/jobs.ts` handles job CRUD
  - `app/api/cover-letter/route.ts` calls OpenAI securely on the server
- **Database (Supabase Postgres):** `jobs` table with user ownership and RLS policies
- **Auth/session layer:** `@supabase/ssr` with middleware session refresh

Request flow:
1. User authenticates with Supabase Auth
2. Server components/actions resolve current user
3. Job queries/mutations are scoped by `user_id`
4. UI refreshes with updated metrics and application list

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **UI:** React 19 + Tailwind CSS 4
- **Database/Auth:** Supabase (`@supabase/supabase-js`, `@supabase/ssr`)
- **AI-assisted utility:** OpenAI Chat Completions (server-side only)
- **Deployment target:** Vercel

## Folder Structure

```text
careerflow/
├── app/
│   ├── actions/              # Server actions (auth + jobs)
│   ├── api/cover-letter/     # Server-side cover letter endpoint
│   ├── auth/callback/        # Supabase auth callback route
│   ├── layout.tsx            # Metadata + global app shell
│   └── page.tsx              # Main dashboard page
├── components/               # UI components and forms
├── lib/
│   ├── supabase/             # Supabase SSR helpers + middleware helpers
│   ├── jobs.ts               # Job typing + dashboard analytics helper
│   └── job-status.ts         # Status options
├── supabase/migrations/      # SQL migration(s) and RLS setup
├── middleware.ts             # Session refresh middleware
└── public/                   # Static assets
```

## Installation

Prerequisites:
- Node.js 20+
- Supabase project
- OpenAI API key (for Cover Letter Studio)

```bash
git clone https://github.com/AMCodes24/careerflow.git
cd careerflow
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Create `.env.local`:

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key |
| `OPENAI_API_KEY` | Optional* | Enables Cover Letter Studio |
| `NEXT_PUBLIC_SITE_URL` | Optional | Auth callback base URL |

\* Optional unless using cover letter generation.

## Supabase Security Configuration

For production safety:
- Enable RLS on `jobs`
- Apply migration in `supabase/migrations/20260510180000_jobs_user_rls.sql`
- Ensure policies scope records to `auth.uid() = user_id`
- Keep service role keys out of client code (none are used in this app)

## Usage Guide

1. Sign up or sign in
2. Add job applications with company/title/status/notes
3. Update status as opportunities progress to interview/offer
4. Use dashboard analytics to monitor search velocity
5. Use Cover Letter Studio for workflow acceleration when needed

## Current Development Status

- Core platform flows complete (auth + CRUD + dashboard analytics)
- Security baseline complete (SSR auth + RLS migration)
- Build/lint pipeline configured
- Automated tests and advanced analytics are planned next

## Roadmap

- Add tests (unit/integration/e2e)
- Add filters, sorting, and search
- Add timeline view for application lifecycle
- Add reminders and follow-up scheduling
- Add richer analytics (conversion rates by stage, weekly trendline)
- Add export/reporting capabilities

## Screenshots

Add screenshots in a future update:
- `docs/screenshots/dashboard.png`
- `docs/screenshots/add-job-form.png`
- `docs/screenshots/cover-letter-studio.png`

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Portfolio / Recruiter Talking Points

- Designed and shipped a secure multi-user full-stack product
- Implemented Supabase auth/session + row-level data isolation
- Built maintainable server-action based CRUD architecture in Next.js
- Added practical workflow automation without exposing API keys client-side
- Delivered a clean, production-oriented UX with analytics-centric dashboarding
