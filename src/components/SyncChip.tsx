"use client";
import { useEffect, useState } from "react";
import { syncStore, kickSync } from "@/lib/sync";
import { isSupabaseConfigured } from "@/lib/supabase";
import { Cloud, CloudOff, RefreshCw } from "lucide-react";

export function SyncChip() {
  const [state, setState] = useState(syncStore.get());
  useEffect(() => syncStore.subscribe(() => setState(syncStore.get())), []);
  if (!isSupabaseConfigured()) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-1 text-[11px] font-medium text-muted">
        <CloudOff size={12} /> Local
      </span>
    );
  }
  return (
    <button
      type="button"
      onClick={() => kickSync()}
      className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-semibold text-brand"
      title={state.lastError ?? "Synchroniser"}
    >
      {state.syncing ? (
        <RefreshCw size={12} className="animate-spin" />
      ) : state.online ? (
        <Cloud size={12} />
      ) : (
        <CloudOff size={12} />
      )}
      {state.pending > 0 ? `${state.pending} en attente` : state.online ? "Sync OK" : "Hors ligne"}
    </button>
  );
}
