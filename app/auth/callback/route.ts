import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

import { getPublicSupabaseConfig } from "@/lib/supabase/env";

function safeRelativePath(raw: string | null): string {
  const nextPath = raw?.trim() || "/";
  if (!nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return "/";
  }
  return nextPath;
}

export async function GET(request: NextRequest) {
  const config = getPublicSupabaseConfig();
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  const nextPath = safeRelativePath(searchParams.get("next"));

  if (!config) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(config.url, config.anonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet, responseHeaders) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
          void responseHeaders;
        },
      },
    });

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${nextPath}`);
    }
  }

  return NextResponse.redirect(new URL("/?auth=error", request.url));
}
