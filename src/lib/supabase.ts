"use client";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export function isSupabaseConfigured() {
  return Boolean(url && anon && !url.includes("YOUR_") && !anon.includes("YOUR_"));
}

let client: SupabaseClient | null = null;

const timedFetch: typeof fetch = (input, init) => {
  const ctrl = new AbortController();
  const timer = setTimeout(
    () => ctrl.abort(new DOMException("Request timed out", "TimeoutError")),
    20_000
  );
  init?.signal?.addEventListener("abort", () => ctrl.abort(init.signal!.reason));
  return fetch(input, { ...init, signal: ctrl.signal }).finally(() => clearTimeout(timer));
};

export function supabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!client) {
    client = createClient(url, anon, {
      auth: { persistSession: true, autoRefreshToken: true, storageKey: "kopi.auth" },
      db: { retry: false },
      global: { fetch: timedFetch },
    });
  }
  return client;
}
