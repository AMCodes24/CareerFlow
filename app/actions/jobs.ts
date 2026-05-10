"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseClient } from "@/lib/supabaseClient";

export type CreateJobResult = { error?: string; success?: true };

export async function updateJob(formData: FormData): Promise<CreateJobResult> {
  const supabase = createSupabaseClient();
  if (!supabase) {
    return { error: "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY." };
  }

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
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  return { success: true };
}

export async function deleteJob(formData: FormData): Promise<CreateJobResult> {
  const supabase = createSupabaseClient();
  if (!supabase) {
    return { error: "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY." };
  }

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return { error: "Missing job id." };
  }

  const { error } = await supabase.from("jobs").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  return { success: true };
}

export async function createJob(formData: FormData): Promise<CreateJobResult> {
  const supabase = createSupabaseClient();
  if (!supabase) {
    return { error: "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY." };
  }

  const company = String(formData.get("company") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!company || !title) {
    return { error: "Company and title are required." };
  }

  const { error } = await supabase.from("jobs").insert({
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
