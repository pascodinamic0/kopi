"use client";
import { db } from "./db";
import { isSupabaseConfigured, supabase } from "./supabase";

export interface SyncState {
  online: boolean;
  syncing: boolean;
  pending: number;
  lastSyncAt: string | null;
  lastError: string | null;
}

let state: SyncState = {
  online: typeof navigator === "undefined" ? true : navigator.onLine,
  syncing: false,
  pending: 0,
  lastSyncAt: typeof localStorage === "undefined" ? null : localStorage.getItem("kopi.lastSync"),
  lastError: null,
};

const listeners = new Set<() => void>();
function setState(p: Partial<SyncState>) {
  state = { ...state, ...p };
  listeners.forEach((l) => l());
}

export const syncStore = {
  get: () => state,
  subscribe(l: () => void) {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
};

type TableName = "jobs" | "clients" | "payments" | "consumables" | "settings" | "users";

async function pushTable(table: TableName) {
  const sb = supabase();
  if (!sb) return;
  const rows = await db.table(table).toArray();
  if (!rows.length) return;
  // settings uses fixed id; nest services/mobileMoney as jsonb
  const payload = rows.map((r: Record<string, unknown>) => {
    const { ...rest } = r;
    return {
      ...rest,
      updated_at: new Date(
        typeof rest.updatedAt === "number"
          ? (rest.updatedAt as number)
          : typeof rest.createdAt === "number"
            ? (rest.createdAt as number)
            : Date.now()
      ).toISOString(),
      synced_at: new Date().toISOString(),
    };
  });
  const { error } = await sb.from(table).upsert(payload, { onConflict: "id" });
  if (error) throw new Error(`${table}: ${error.message}`);
}

async function pullTable(table: TableName) {
  const sb = supabase();
  if (!sb) return;
  const { data, error } = await sb.from(table).select("*").limit(2000);
  if (error) throw new Error(`${table}: ${error.message}`);
  if (!data?.length) return;
  const normalized = data.map((row: Record<string, unknown>) => {
    const out: Record<string, unknown> = { ...row };
    // map snake timestamps back if present
    if (typeof out.created_at === "string" && !out.createdAt) {
      out.createdAt = Date.parse(out.created_at as string) || Date.now();
    }
    if (typeof out.updated_at === "string" && !out.updatedAt) {
      out.updatedAt = Date.parse(out.updated_at as string) || Date.now();
    }
    delete out.synced_at;
    delete out.created_at;
    delete out.updated_at;
    return out;
  });
  await db.table(table).bulkPut(normalized as never[]);
}

export async function kickSync() {
  if (!isSupabaseConfigured()) {
    setState({ lastError: "Supabase non configuré" });
    return;
  }
  if (state.syncing) return;
  setState({ syncing: true, lastError: null, online: navigator.onLine });
  try {
    const tables: TableName[] = ["settings", "clients", "jobs", "payments", "consumables", "users"];
    for (const t of tables) await pushTable(t);
    for (const t of tables) await pullTable(t);
    const now = new Date().toISOString();
    localStorage.setItem("kopi.lastSync", now);
    setState({ lastSyncAt: now, pending: 0, syncing: false });
  } catch (e) {
    setState({
      syncing: false,
      lastError: e instanceof Error ? e.message : String(e),
      online: navigator.onLine,
    });
  }
}

if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    setState({ online: true });
    void kickSync();
  });
  window.addEventListener("offline", () => setState({ online: false }));
}
