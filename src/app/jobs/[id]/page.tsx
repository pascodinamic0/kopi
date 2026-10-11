"use client";
import { useParams, useRouter } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { formatFC, dualForRate } from "@/lib/money";
import type { Job, PaymentMethod } from "@/lib/types";
import { Button, Card, inputClass } from "@/components/ui";

export default function JobDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const job = useLiveQuery(() => db.jobs.get(String(params.id)), [params.id]) as Job | undefined;
  const settings = useLiveQuery(() => db.settings.get("settings"), []);
  const payments =
    useLiveQuery(() => db.payments.where("jobId").equals(String(params.id)).toArray(), [params.id]) ??
    [];

  if (!job) {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-bold">Commande</h1>
        <p className="text-muted">Aucune commande trouvée.</p>
      </div>
    );
  }

  const current = job;
  const remaining = Math.max(0, current.totalFC - current.paidFC);

  async function addPayment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const method = String(formData.get("method") || "cash") as PaymentMethod;
    const amountFC = Number(formData.get("amountFC") || 0);
    if (amountFC <= 0) return;
    await db.payments.add({
      id: crypto.randomUUID(),
      jobId: current.id,
      method,
      amountFC,
      createdAt: Date.now(),
    });
    await db.jobs.update(current.id, {
      paidFC: Math.min(current.totalFC, current.paidFC + amountFC),
      updatedAt: Date.now(),
    });
  }

  async function setStatus(next: Job["status"]) {
    await db.jobs.update(current.id, { status: next, updatedAt: Date.now() });
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{job.ref}</h1>
        <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold capitalize text-brand">
          {job.status.replace("_", " ")}
        </span>
      </div>

      <Card className="p-4">
        <h2 className="font-semibold">Articles</h2>
        <ul className="mt-2 space-y-2">
          {job.items.map((it) => (
            <li key={it.id} className="flex items-center justify-between text-sm">
              <span>
                {it.quantity} × {formatFC(it.unitPriceFC)}
                {it.note ? <span className="ml-2 text-muted">({it.note})</span> : null}
              </span>
              <span className="font-medium tabular">{formatFC(it.quantity * it.unitPriceFC)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 space-y-1 border-t border-line pt-3 text-sm">
          <div className="flex justify-between">
            <span>Total</span>
            <span className="font-semibold tabular">
              {formatFC(job.totalFC)}{" "}
              <span className="ml-1 text-muted">{dualForRate(job.totalFC, settings?.fxRateUsd ?? 2800)}</span>
            </span>
          </div>
          <div className="flex justify-between">
            <span>Payé</span>
            <span className="tabular">{formatFC(job.paidFC)}</span>
          </div>
          <div className="flex justify-between">
            <span>Reste</span>
            <span className={`font-semibold tabular ${remaining > 0 ? "text-danger" : "text-ok"}`}>
              {formatFC(remaining)}
            </span>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h2 className="font-semibold">Paiements</h2>
        <ul className="mt-2 space-y-2 text-sm">
          {payments.map((p) => (
            <li key={p.id} className="flex justify-between">
              <span className="capitalize">{p.method}</span>
              <span className="tabular">{formatFC(p.amountFC)}</span>
            </li>
          ))}
        </ul>
        <form className="mt-3 grid grid-cols-3 gap-2" onSubmit={addPayment}>
          <select name="method" className={inputClass} defaultValue="cash">
            <option value="cash">Cash</option>
            <option value="mpesa">M‑Pesa</option>
            <option value="airtel">Airtel</option>
            <option value="orange">Orange</option>
          </select>
          <input name="amountFC" type="number" min={1} defaultValue={remaining} className={inputClass} />
          <Button type="submit" size="sm">
            Ajouter
          </Button>
        </form>
      </Card>

      <div className="grid grid-cols-2 gap-2">
        {job.status === "recu" && (
          <Button variant="dark" onClick={() => setStatus("en_cours")}>
            ⇨ En cours
          </Button>
        )}
        {job.status === "en_cours" && (
          <Button variant="dark" onClick={() => setStatus("pret")}>
            ⇨ Prêt
          </Button>
        )}
        {job.status === "pret" && (
          <Button variant="dark" onClick={() => setStatus("livre")}>
            ⇨ Livré
          </Button>
        )}
      </div>

      <Button variant="secondary" onClick={() => router.push("/jobs")}>
        ← Retour aux travaux
      </Button>
    </div>
  );
}
