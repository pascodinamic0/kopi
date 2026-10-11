"use client";
import { db } from "@/lib/db";
import { formatFC } from "@/lib/money";
import { useLiveQuery } from "dexie-react-hooks";
import { Button, Card, Field, inputClass } from "@/components/ui";

function uid() {
  return crypto.randomUUID();
}

async function createJobClient(data: {
  serviceId: string;
  quantity: number;
  note?: string;
}) {
  const s = await db.settings.get("settings");
  const service = s?.services.find((x) => x.id === data.serviceId);
  if (!service) return;
  const item = {
    id: uid(),
    serviceId: data.serviceId,
    quantity: data.quantity,
    unitPriceFC: service.priceFC,
    note: data.note,
  };
  const total = item.quantity * item.unitPriceFC;
  const job = {
    id: uid(),
    ref: `K-${Math.floor(Math.random() * 900 + 100)}`,
    items: [item],
    totalFC: total,
    paidFC: 0,
    status: "recu" as const,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  await db.jobs.add(job);
  window.location.href = "/jobs";
}

export default function NewJobPage() {
  const settings = useLiveQuery(() => db.settings.get("settings"), []);
  const services = settings?.services ?? [];
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await createJobClient({
      serviceId: String(fd.get("serviceId")),
      quantity: Number(fd.get("quantity") || 1),
      note: String(fd.get("note") || ""),
    });
  }
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Nouvelle commande</h1>
      <Card className="overflow-hidden">
        <img src="/img/banner.jpg" alt="" className="h-24 w-full object-cover" />
        <form onSubmit={onSubmit} className="space-y-4 p-4">
          <Field label="Service">
            <select name="serviceId" className={inputClass} required>
              <option value="">Sélectionner…</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — {formatFC(s.priceFC)} / {s.unit}
                </option>
              ))}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Quantité">
              <input type="number" min={1} name="quantity" defaultValue={1} className={inputClass} />
            </Field>
            <Field label="Note">
              <input type="text" name="note" placeholder="Fichier, couleurs…" className={inputClass} />
            </Field>
          </div>
          <Button type="submit" block>
            Enregistrer
          </Button>
        </form>
      </Card>
    </div>
  );
}
