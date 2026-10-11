"use client";
import React from "react";
import { db } from "@/lib/db";
import { purgeDemoForProduction } from "@/lib/seed";
import Link from "next/link";
import { GoLiveButton } from "../../(routes)/_components/GoLiveClient";
import { useLiveQuery } from "dexie-react-hooks";
import { runQAChecks } from "@/lib/qa";
import type { QAResult } from "@/lib/qa_types";

async function runQA(): Promise<QAResult> {
  return runQAChecks();
}

export default function GoLivePage() {
  const settings = useLiveQuery(() => db.settings.get("settings"), []);
  const superAdmin = useLiveQuery(() => db.users.where("role").equals("super_admin").first(), []);

  async function action() {
    if (!superAdmin) {
      alert("Accès réservé au super‑admin.");
      return;
    }
    const qa = await runQA();
    if (!qa.ok) {
      alert(
        "QA échouée:\n" +
          qa.checks.filter((c) => !c.ok).map((c) => `- ${c.title}`).join("\n")
      );
      return;
    }
    await purgeDemoForProduction();
    window.location.href = "/onboarding";
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Passer en production</h1>
      <p className="text-gray-600">
        Cette opération lance une batterie de tests automatique. Si elle
        réussit, toutes les données de démo seront supprimées et
        l&apos;onboarding production commencera. Sinon, rien ne sera effacé.
      </p>
      <div className="rounded border bg-white p-3">
        <div className="flex items-center justify-between">
          <div>
            Mode actuel:{" "}
            <strong>{settings?.mode === "production" ? "Production" : "Démo"}</strong>
          </div>
          <div className="text-xs text-gray-500">
            Super‑admin: {superAdmin ? "présent" : "absent"}
          </div>
          <Link className="underline" href="/">
            Retour
          </Link>
        </div>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          action();
        }}
      >
        <GoLiveButton />
      </form>
      <QAInline />
    </div>
  );
}

function QAInline() {
  const [qa, setQa] = React.useState<QAResult | null>(null);
  React.useEffect(() => {
    runQA().then(setQa);
  }, []);
  if (!qa) return <div className="text-sm text-gray-500">Analyse…</div>;
  return (
    <div className="rounded border bg-white p-3">
      <h2 className="mb-2 text-lg font-medium">Vérifications</h2>
      <ul className="space-y-1">
        {qa.checks.map((c) => (
          <li key={c.id} className="flex items-center justify-between">
            <span>{c.title}</span>
            <span className={c.ok ? "text-emerald-600" : "text-rose-600"}>
              {c.ok ? "OK" : "Échec"}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-2 text-sm">
        Résultat global:{" "}
        <strong className={qa.ok ? "text-emerald-700" : "text-rose-700"}>
          {qa.ok ? "Prêt" : "Bloqué"}
        </strong>
      </div>
    </div>
  );
}

