"use client";
import { db } from "@/lib/db";
import { formatFC } from "@/lib/money";
import { useLiveQuery } from "dexie-react-hooks";
import { Button, Card } from "@/components/ui";
import { Wallet } from "lucide-react";

async function settle(jobId: string) {
  const job = await db.jobs.get(jobId);
  if (!job) return;
  const remaining = job.totalFC - job.paidFC;
  if (remaining <= 0) return;
  await db.payments.add({
    id: crypto.randomUUID(),
    jobId,
    method: "cash",
    amountFC: remaining,
    createdAt: Date.now(),
  });
  await db.jobs.update(jobId, { paidFC: job.totalFC, updatedAt: Date.now() });
}

export default function CreditPage() {
  const jobs = useLiveQuery(() => db.jobs.toArray(), []) ?? [];
  const debts = jobs.filter((j) => j.totalFC > j.paidFC);
  const total = debts.reduce((s, j) => s + (j.totalFC - j.paidFC), 0);
  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-[24px] border border-line">
        <img src="/img/business-cards.jpg" alt="" className="h-28 w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <Wallet size={22} /> Impayés
          </h1>
        </div>
      </div>
      <Card className="bg-gold-soft p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">Total crédit</p>
        <p className="mt-1 text-3xl font-extrabold tabular text-ink">{formatFC(total)}</p>
      </Card>
      <ul className="space-y-3">
        {debts.map((j) => {
          const remaining = j.totalFC - j.paidFC;
          return (
            <Card key={j.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="font-semibold">{j.ref}</div>
                <div className="font-bold tabular text-danger">{formatFC(remaining)}</div>
              </div>
              <Button onClick={() => settle(j.id)} className="mt-3" block size="sm">
                Régler
              </Button>
            </Card>
          );
        })}
        {!debts.length ? (
          <Card className="p-8 text-center text-sm text-muted">Aucun impayé 🎉</Card>
        ) : null}
      </ul>
    </div>
  );
}
