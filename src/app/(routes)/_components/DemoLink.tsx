"use client";
import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";

export function DemoLink() {
  const settings = useLiveQuery(() => db.settings.get("settings"), []);
  if (settings?.mode === "production") return null;
  return (
    <Link
      href="/demo"
      className="text-xs font-medium text-violet-700 hover:underline"
    >
      Démo
    </Link>
  );
}

