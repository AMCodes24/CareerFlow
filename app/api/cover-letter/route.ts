/**
 * Cover letter generation — requires server-side secret:
 * OPENAI_API_KEY — add to `.env.local` (never commit real keys).
 *
 * @see
 * https://platform.openai.com/docs/api-reference/chat/create
 */

import { NextRequest, NextResponse } from "next/server";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const REQUEST_TIMEOUT_MS = 55_000;
const MAX_COMPANY_LEN = 200;
const MAX_TITLE_LEN = 200;
const MAX_DESCRIPTION_LEN = 20_000;
const MIN_DESCRIPTION_LEN = 20;

type Body = {
  company?: unknown;
  jobTitle?: unknown;
  jobDescription?: unknown;
};

function trimString(value: unknown, max: number): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const t = value.trim();
  if (!t) {
    return null;
  }
  return t.length > max ? t.slice(0, max) : t;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Cover letter generation is unavailable: set OPENAI_API_KEY in .env.local.",
      },
      { status: 503 },
    );
  }

  let raw: Body;
  try {
    raw = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Request body must be JSON." }, { status: 400 });
  }

  const company = trimString(raw.company, MAX_COMPANY_LEN);
  const jobTitle = trimString(raw.jobTitle, MAX_TITLE_LEN);
  const jobDescription = trimString(raw.jobDescription, MAX_DESCRIPTION_LEN);

  if (!company) {
    return NextResponse.json(
      { error: "Company name is required." },
      { status: 400 },
    );
  }
  if (!jobTitle) {
    return NextResponse.json(
      { error: "Job title is required." },
      { status: 400 },
    );
  }
  if (!jobDescription) {
    return NextResponse.json(
      { error: "Job description is required." },
      { status: 400 },
    );
  }
  if (jobDescription.length < MIN_DESCRIPTION_LEN) {
    return NextResponse.json(
      {
        error: `Job description must be at least ${MIN_DESCRIPTION_LEN} characters.`,
      },
      { status: 400 },
    );
  }

  const userMessage = [
    `Company: ${company}`,
    `Role: ${jobTitle}`,
    "",
    "Job description:",
    jobDescription,
    "",
    "Write a tailored professional cover letter (about 3–4 short paragraphs). Use a confident, warm tone. Do not invent credentials or employers; if specifics are missing, keep claims general. End with a brief closing and do not repeat the entire job posting.",
  ].join("\n");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let openaiRes: Response;
  try {
    openaiRes = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You write clear, compelling job application cover letters. Output only the letter body (no subject line, no markdown code fences unless the user asks).",
          },
          { role: "user", content: userMessage },
        ],
        temperature: 0.65,
        max_tokens: 1200,
      }),
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeout);
    if (err instanceof Error && err.name === "AbortError") {
      return NextResponse.json(
        { error: "The request took too long. Try a shorter job description and try again." },
        { status: 504 },
      );
    }
    return NextResponse.json(
      { error: "Could not reach the cover letter service. Check your connection and try again." },
      { status: 502 },
    );
  } finally {
    clearTimeout(timeout);
  }

  if (!openaiRes.ok) {
    let detail = openaiRes.statusText;
    try {
      const errJson = (await openaiRes.json()) as {
        error?: { message?: string };
      };
      if (errJson?.error?.message) {
        detail = errJson.error.message;
      }
    } catch {
      /* ignore */
    }
    console.error("[cover-letter] OpenAI error:", openaiRes.status, detail);
    return NextResponse.json(
      { error: "Cover letter generation failed. Try again in a moment." },
      { status: 502 },
    );
  }

  let payload: {
    choices?: Array<{ message?: { content?: string } }>;
  };
  try {
    payload = (await openaiRes.json()) as typeof payload;
  } catch {
    return NextResponse.json(
      { error: "Unexpected response from the cover letter service." },
      { status: 502 },
    );
  }

  const letter = payload.choices?.[0]?.message?.content?.trim();
  if (!letter) {
    return NextResponse.json(
      { error: "No cover letter was generated. Try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ letter });
}
