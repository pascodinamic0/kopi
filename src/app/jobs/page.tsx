"use client";
import { db } from "@/lib/db";
import { formatFC } from "@/lib/money";
import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { motion } from "motion/react";
import { Plus } from "lucide-react";
import { Button, Card } from "@/components/ui";

async function setStatus(id: string, status: string) {
  const job = await db.jobs.get(id);
  if (!job) return;
  await db.jobs.update(id, { status: status as never, updatedAt: Date.now() });
}

const STATUS_LABEL: Record<string, string> = {
  en_cours: "En cours",
  pret: "Prêt",
  livre: "Livré",
};

export default function JobsPage() {
  const jobs = useLiveQuery(
    () => db.jobs.orderBy("createdAt").reverse().toArray(),
    []
  );
  const list = jobs ?? [];
  const grouped = {
    recu: list.filter((j) => j.status === "recu"),
    en_cours: list.filter((j) => j.status === "en_cours"),
    pret: list.filter((j) => j.status === "pret"),
    livre: list.filter((j) => j.status === "livre"),
  };

  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-[24px] border border-line">
        <img src="/img/printer.jpg" alt="" className="h-28 w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 text-white">
          <div>
            <h1 className="text-2xl font-bold">Travaux</h1>
            <p className="text-sm text-white/80">{list.length} commande(s)</p>
          </div>
          <Link href="/jobs/new">
            <Button size="sm" className="!bg-white !text-brand">
              <Plus size={16} /> Nouveau
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Column title="Reçu" jobs={grouped.recu} onNext="en_cours" tone="info" />
        <Column title="En cours" jobs={grouped.en_cours} onNext="pret" tone="gold" />
        <Column title="Prêt" jobs={grouped.pret} onNext="livre" tone="ok" />
        <Column title="Livré" jobs={grouped.livre} tone="default" />
      </div>
    </div>
  );
}

function Column({
  title,
  jobs,
  onNext,
  tone,
}: {
  title: string;
  jobs: { id: string; ref: string; totalFC: number; items: unknown[] }[];
  onNext?: string;
  tone: "info" | "gold" | "ok" | "default";
}) {
  const dots = {
    info: "bg-info",
    gold: "bg-gold",
    ok: "bg-ok",
    default: "bg-muted",
  };
  return (
    <Card className="p-3">
      <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold">
        <span className={`h-2 w-2 rounded-full ${dots[tone]}`} />
        {title}
        <span className="ml-auto text-xs text-muted">{jobs.length}</span>
      </h2>
      <ul className="space-y-2">
        {jobs.map((j, i) => (
          <motion.li
            key={j.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="rounded-xl border border-line bg-surface-2/60 p-2.5"
          >
            <div className="flex items-center justify-between gap-2">
              <Link href={`/jobs/${j.id}`} className="text-sm font-semibold text-brand">
                {j.ref}
              </Link>
              <div className="text-sm font-medium tabular">{formatFC(j.totalFC)}</div>
            </div>
            <div className="mt-1 text-[11px] text-muted">{j.items.length} article(s)</div>
            {onNext ? (
              <button
                onClick={() => setStatus(j.id, onNext)}
                className="mt-2 w-full rounded-xl bg-ink px-2 py-1.5 text-xs font-semibold text-white"
                type="button"
              >
                ⇨ {STATUS_LABEL[onNext] ?? onNext}
              </button>
            ) : null}
          </motion.li>
        ))}
        {!jobs.length ? (
          <li className="rounded-xl border border-dashed border-line px-2 py-6 text-center text-xs text-muted">
            Vide
          </li>
        ) : null}
      </ul>
    </Card>
  );
}
