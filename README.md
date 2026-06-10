# CareerFlow

CareerFlow is a [Next.js](https://nextjs.org) app for tracking job applications, interviews, and follow-ups in one place. Signed-in users get a private dashboard with per-user row-level security via Supabase, plus Cover Letter Studio for tailored application letters.

## Features

- **Application tracker** — log company, title, status, and notes
- **Dashboard metrics** — applied count, interviews, and response rate
- **Cover Letter Studio** — generate role-specific cover letters from job postings
- **Auth** — email/password sign-in and sign-up with Supabase

## Getting Started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create `.env.local` with:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `OPENAI_API_KEY` | Cover letter generation (server-side only) |

## Project Structure

```
app/
  page.tsx              # Home dashboard
  api/cover-letter/     # Cover letter generation API
  actions/              # Server actions (auth, jobs)
components/
  cover-letter-studio.tsx
  add-job-form.tsx
  auth-header.tsx
lib/
  supabase/             # Supabase clients and middleware
```

## Scripts

```bash
npm run dev     # Start development server
npm run build   # Production build
npm run start   # Start production server
npm run lint    # Run ESLint
```

## Deploy on Vercel

Deploy with the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme). Add the environment variables above in your project settings.

## Documentation

See [docs/careerflow-codebase-explanation.pdf](docs/careerflow-codebase-explanation.pdf) for an architecture overview.
