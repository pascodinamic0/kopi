"use client";
import { useFormStatus } from "react-dom";
import { useEffect } from "react";

export function GoLiveButton() {
  const status = useFormStatus();
  useEffect(() => {
    // no-op
  }, [status]);
  return (
    <button
      disabled={status.pending}
      type="submit"
      className="w-full rounded-lg bg-rose-600 px-4 py-3 text-white shadow transition active:scale-95 disabled:opacity-50"
    >
      {status.pending ? "Vérification…" : "Passer en production"}
    </button>
  );
}

