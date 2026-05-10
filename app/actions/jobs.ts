"use server";

import { revalidatePath } from "next/cache";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export type CreateJobResult = { error?: string; success?: true };

async function requireUserSupabase() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return {
      error: "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    } as const;
  }
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: "You must be signed in." } as const;
  }
  return { supabase, user } as const;
}

export async function updateJob(formData: FormData): Promise<CreateJobResult> {
  const ctx = await requireUserSupabase();
  if ("error" in ctx) {
    return { error: ctx.error };
  }
  const { supabase, user } = ctx;

  const id = String(formData.get("id") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!id) {
    return { error: "Missing job id." };
  }
  if (!company || !title) {
    return { error: "Company and title are required." };
  }

  const { error } = await supabase
    .from("jobs")
    .update({
      company,
      title,
      status: status || null,
      notes: notes || null,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  return { success: true };
}

export async function deleteJob(formData: FormData): Promise<CreateJobResult> {
  const ctx = await requireUserSupabase();
  if ("error" in ctx) {
    return { error: ctx.error };
  }
  const { supabase, user } = ctx;

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return { error: "Missing job id." };
  }

  const { error } = await supabase.from("jobs").delete().eq("id", id).eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  return { success: true };
}

export async function createJob(formData: FormData): Promise<CreateJobResult> {
  const ctx = await requireUserSupabase();
  if ("error" in ctx) {
    return { error: ctx.error };
  }
  const { supabase, user } = ctx;

  const company = String(formData.get("company") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!company || !title) {
    return { error: "Company and title are required." };
  }

  const { error } = await supabase.from("jobs").insert({
    user_id: user.id,
    company,
    title,
    status: status || null,
    notes: notes || null,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  return { success: true };
}
