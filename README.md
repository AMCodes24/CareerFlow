# CareerFlow

**CareerFlow** is a full-stack job search management platform that helps you track applications, monitor interview progress, and stay organized from first outreach to final offer.

> **Resume summary:** Built a production-ready Next.js application with Supabase authentication, row-level security, real-time dashboard metrics, full job CRUD, and server-side cover letter generation—designed with a clean, professional UI focused on organization and career momentum.

**Live repository:** [github.com/AMCodes24/careerflow](https://github.com/AMCodes24/careerflow)

---

## Project Overview

CareerFlow is a single-page dashboard for managing your job search. Users sign in with email and password, log applications with company details and status, view pipeline metrics at a glance, edit or delete entries, and generate tailored cover letters from job postings—all in one place.

The app is branded as a professional career workflow tool (similar in spirit to Notion, Linear, or Airtable) rather than an AI-first product. Intelligent features run in the background; the experience centers on visibility, organization, and follow-through.

---

## Problem It Solves

Job searching is fragmented. Spreadsheets go stale, notes live in email threads, and it's easy to lose track of where each application stands. CareerFlow solves this by providing:

- **One source of truth** for every application, interview, and note
- **Clear pipeline visibility** with status tracking and dashboard metrics
- **Faster application prep** with role-specific cover letter drafts
- **Secure, per-user data** so your search stays private

---

## Key Features

| Feature | Description |
| --- | --- |
| **Application tracker** | Add jobs with company, title, status, and notes |
| **Dashboard metrics** | Total applications, interview count, and response rate |
| **Recent applications** | Scrollable list with inline edit and delete |
| **Status management** | Track pipeline stages (applied, interviewing, offer, etc.) |
| **Cover Letter Studio** | Generate tailored cover letters from job descriptions |
| **Authentication** | Email/password sign-up, sign-in, and sign-out via Supabase |
| **Per-user data isolation** | Row-level security ensures users only see their own jobs |
| **Responsive UI** | Dark, modern interface built with Tailwind CSS |

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| **Framework** | [Next.js 16](https://nextjs.org) (App Router) |
| **Language** | TypeScript |
| **UI** | React 19, Tailwind CSS 4 |
| **Database** | [Supabase](https://supabase.com) (PostgreSQL) |
| **Authentication** | Supabase Auth with cookie-based SSR (`@supabase/ssr`) |
| **Cover letters** | OpenAI Chat Completions API (server-side only) |
| **Deployment** | Vercel-ready |

---

## Folder Structure

```
careerflow/
├── app/
│   ├── page.tsx                 # Home dashboard (server component)
│   ├── layout.tsx               # Root layout, metadata, Open Graph
│   ├── globals.css              # Global styles + Tailwind
│   ├── actions/
│   │   ├── auth.ts              # Sign up, sign in, sign out
│   │   └── jobs.ts              # Create, update, delete jobs
│   ├── api/cover-letter/
│   │   └── route.ts             # Secure cover letter generation API
│   └── auth/callback/
│       └── route.ts             # Email confirmation / PKCE callback
├── components/
│   ├── auth-header.tsx          # Auth forms in header
│   ├── add-job-form.tsx         # New application form
│   ├── recent-applications-list.tsx  # Job list with edit/delete
│   └── cover-letter-studio.tsx  # Cover letter generator UI
├── lib/
│   ├── jobs.ts                  # Job types and dashboard metrics
│   ├── job-status.ts            # Allowed status values
│   └── supabase/                # Server client, middleware, env helpers
├── middleware.ts                # Session refresh on each request
├── supabase/migrations/         # Database RLS policies
├── public/                      # Static assets (favicon, icons)
└── docs/                        # Architecture documentation (PDF)
```

---

## Installation

### Prerequisites

- [Node.js](https://nodejs.org) 20+
- A [Supabase](https://supabase.com) project
- An [OpenAI](https://platform.openai.com) API key (for Cover Letter Studio)

### Steps

```bash
# Clone the repository
git clone https://github.com/AMCodes24/careerflow.git
cd careerflow

# Install dependencies
npm install

# Configure environment (see below)
cp .env.example .env.local   # or create .env.local manually

# Run database migration in Supabase SQL Editor
# (see supabase/migrations/20260510180000_jobs_user_rls.sql)

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Create a `.env.local` file in the project root:

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL (Settings → API) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous/public key |
| `OPENAI_API_KEY` | Yes* | OpenAI API key for cover letter generation |
| `NEXT_PUBLIC_SITE_URL` | Optional | Site URL for email confirmation redirects (e.g. `http://localhost:3000`) |

\* Required only if using Cover Letter Studio.

**Never commit `.env.local` or expose API keys in client-side code.** The OpenAI key is used exclusively in the server-side API route.

### Supabase setup

1. Create a `jobs` table with columns: `id`, `user_id`, `company`, `title`, `status`, `notes`, `created_at`
2. Run the migration in `supabase/migrations/20260510180000_jobs_user_rls.sql` to enable row-level security
3. In Supabase Auth settings, add your callback URL: `{SITE_URL}/auth/callback`

---

## Usage Guide

1. **Sign up** — Create an account with email and password from the header.
2. **Add applications** — Fill in company, title, status, and notes, then click **Add Job**.
3. **Track progress** — View dashboard metrics and your recent applications list.
4. **Edit or delete** — Use row actions to update details or remove entries.
5. **Generate cover letters** — Open **Cover Letter Studio**, paste the job description, and click **Generate cover letter**. Copy the result to your clipboard.

---

## Current Development Status

| Area | Status |
| --- | --- |
| Landing page & dashboard | Complete |
| Supabase auth (email/password) | Complete |
| Job CRUD with user scoping | Complete |
| Row-level security migration | Complete |
| Cover Letter Studio | Complete |
| Responsive dark UI | Complete |
| Automated tests | Not yet implemented |
| Search / filtering | Not yet implemented |

---

## Roadmap / Future Improvements

- [ ] Add automated tests (auth flows, CRUD, API route)
- [ ] Search and filter applications by company, status, or date
- [ ] Interview scheduling and follow-up reminders
- [ ] Networking contact tracker
- [ ] Export applications to CSV or PDF
- [ ] Stronger TypeScript types generated from Supabase schema
- [ ] Require authentication on the cover letter API route
- [ ] Mobile-optimized layouts and PWA support

---

## Screenshots

> Add screenshots here after deploying or running locally.

| Dashboard | Add Application | Cover Letter Studio |
| --- | --- | --- |
| _screenshot-dashboard.png_ | _screenshot-add-job.png_ | _screenshot-cover-letter.png_ |

```bash
# Suggested: capture at 1280×800 and save to docs/screenshots/
```

---

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## Deploy on Vercel

1. Push to GitHub and import the repo in [Vercel](https://vercel.com/new)
2. Add environment variables in Project Settings → Environment Variables
3. Deploy

Set `NEXT_PUBLIC_SITE_URL` to your production URL and add `{production-url}/auth/callback` in Supabase Auth URL configuration.

---

## Documentation

For a beginner-friendly architecture walkthrough, see:

[docs/careerflow-codebase-explanation.pdf](docs/careerflow-codebase-explanation.pdf)

---

## License

Private project. All rights reserved.
