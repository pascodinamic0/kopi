"use client";
import React from "react";
import { seedDemoData } from "@/lib/seed";
import { db } from "@/lib/db";
import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";

export default function DemoPage() {
  const s = useLiveQuery(() => db.settings.get("settings"), []);
  const isSeeded = !!s;
  // If already in production, block demo
  React.useEffect(() => {
    if (s?.mode === "production") {
      window.location.href = "/";
    }
  }, [s?.mode]);
  async function doSeed() {
    await seedDemoData();
    window.location.href = "/";
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Démo Kopi</h1>
      <p className="text-muted-foreground">
        Charger les données de démonstration pour le point de vente{" "}
        <strong>Kopi Gombe</strong>.
      </p>
      <button
        onClick={doSeed}
        className="rounded-md bg-violet-600 px-4 py-2 text-white shadow hover:bg-violet-700 active:scale-95"
        type="button"
      >
        Charger la démo
      </button>
      {isSeeded ? (
        <p className="text-sm">
          Données déjà présentes. Allez au{" "}
          <Link className="text-violet-700 underline" href="/">
            tableau de bord
          </Link>
          .
        </p>
      ) : null}
    </div>
  );
}

