"use client";

import { useState } from "react";

type ApiOk = { letter: string };
type ApiErr = { error: string };

const CLIENT_TIMEOUT_MS = 60_000;
const MIN_DESCRIPTION_LEN = 20;

export function CoverLetterStudio() {
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [letter, setLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copyHint, setCopyHint] = useState<string | null>(null);

  async function generate() {
    setError(null);
    setCopyHint(null);
    setLetter("");
    setLoading(true);
    const controller = new AbortController();
    const t = window.setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS);
    try {
      const res = await fetch("/api/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company,
          jobTitle,
          jobDescription,
        }),
        signal: controller.signal,
      });
      let data: ApiOk & ApiErr;
      try {
        data = (await res.json()) as ApiOk & ApiErr;
      } catch {
        setError("Unexpected response from the server.");
        return;
      }
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      if ("letter" in data && typeof data.letter === "string") {
        setLetter(data.letter);
      } else {
        setError("Unexpected response from the server.");
      }
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") {
        setError("Request timed out. Try again with a shorter description.");
      } else {
        setError("Network error. Check your connection and try again.");
      }
    } finally {
      window.clearTimeout(t);
      setLoading(false);
    }
  }

  async function copyLetter() {
    setCopyHint(null);
    if (!letter) {
      return;
    }
    try {
      await navigator.clipboard.writeText(letter);
      setCopyHint("Copied to clipboard.");
    } catch {
      setCopyHint("Could not copy automatically — select the text and copy manually (Ctrl+C).");
    }
  }

  return (
    <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
      <details className="group">
        <summary className="cursor-pointer list-none text-xs font-medium text-slate-200 [&::-webkit-details-marker]:hidden">
          <span className="flex items-center justify-between gap-2">
            <span>Cover Letter Studio</span>
            <span className="text-slate-500 transition group-open:rotate-180">▼</span>
          </span>
        </summary>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">
          Tailor each submission with role-specific highlights and concise value
          propositions in seconds.
        </p>

        <div className="mt-4 space-y-3 border-t border-slate-800 pt-4">
          <label className="block text-xs text-slate-400">
            Company
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              autoComplete="organization"
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-500/60 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
              placeholder="Acme Corp"
              disabled={loading}
            />
          </label>
          <label className="block text-xs text-slate-400">
            Job title
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              autoComplete="organization-title"
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-500/60 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
              placeholder="Software Engineer"
              disabled={loading}
            />
          </label>
          <label className="block text-xs text-slate-400">
            Job description
            <textarea
              value={jobDescription}
              onChange={(e) => {
                setJobDescription(e.target.value);
                setCopyHint(null);
              }}
              rows={6}
              className="mt-1 w-full resize-y rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-500/60 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
              placeholder="Paste the posting or key requirements here…"
              disabled={loading}
            />
            <p className="mt-1 text-[0.65rem] text-slate-500">
              {jobDescription.trim().length} characters — minimum {MIN_DESCRIPTION_LEN} to
              generate
            </p>
          </label>

          {error ? (
            <p className="text-xs text-red-400" role="alert">
              {error}
            </p>
          ) : null}
          {copyHint ? (
            <p
              className={
                copyHint.startsWith("Copied")
                  ? "text-xs text-emerald-400"
                  : "text-xs text-amber-200/90"
              }
              role="status"
            >
              {copyHint}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void generate()}
              disabled={
                loading ||
                !company.trim() ||
                !jobTitle.trim() ||
                jobDescription.trim().length < MIN_DESCRIPTION_LEN
              }
              className="rounded-lg bg-cyan-500/90 px-4 py-2 text-xs font-medium text-slate-950 transition-colors hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-cyan-400/70"
            >
              {loading ? "Generating…" : "Generate cover letter"}
            </button>
            {letter ? (
              <button
                type="button"
                onClick={() => void copyLetter()}
                disabled={loading}
                className="rounded-lg border border-slate-600 bg-slate-900/80 px-4 py-2 text-xs font-medium text-slate-200 transition-colors hover:border-cyan-500/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              >
                Copy to clipboard
              </button>
            ) : null}
          </div>

          {letter ? (
            <label className="block text-xs text-slate-400">
              Generated letter
              <textarea
                readOnly
                value={letter}
                rows={12}
                className="mt-1 w-full resize-y rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 font-sans text-sm leading-relaxed text-slate-100"
              />
            </label>
          ) : null}
        </div>
      </details>
    </div>
  );
}
