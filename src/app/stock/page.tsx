"use client";
import { db } from "@/lib/db";
import { useLiveQuery } from "dexie-react-hooks";
import { Button, Card, Field, inputClass } from "@/components/ui";
import { Package } from "lucide-react";

const STOCK_IMG: Record<string, string> = {
  papier: "/img/paper.jpg",
  toner: "/img/toner.jpg",
  bâche: "/img/bache.jpg",
  bache: "/img/bache.jpg",
  default: "/img/photocopy.jpg",
};

function imgFor(name: string) {
  const n = name.toLowerCase();
  if (n.includes("papier")) return STOCK_IMG.papier;
  if (n.includes("toner") || n.includes("cartouche")) return STOCK_IMG.toner;
  if (n.includes("bâche") || n.includes("bache")) return STOCK_IMG.bache;
  return STOCK_IMG.default;
}

async function addOrUpdate(data: {
  id?: string;
  name: string;
  unit: string;
  stock: number;
  minStock?: number;
}) {
  if (!data.name) return;
  if (data.id) {
    await db.consumables.update(data.id, {
      name: data.name,
      unit: data.unit,
      stock: data.stock,
      minStock: data.minStock,
    });
  } else {
    await db.consumables.add({
      id: crypto.randomUUID(),
      name: data.name,
      unit: data.unit,
      stock: data.stock,
      minStock: data.minStock,
    });
  }
}

export default function StockPage() {
  const items = useLiveQuery(() => db.consumables.toArray(), []) ?? [];
  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-[24px] border border-line">
        <img src="/img/paper.jpg" alt="" className="h-28 w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <Package size={22} /> Consommables
          </h1>
          <p className="text-sm text-white/80">{items.length} article(s)</p>
        </div>
      </div>

      <ul className="space-y-3">
        {items.map((i) => {
          const low = i.minStock !== undefined && i.stock <= (i.minStock ?? 0);
          return (
            <Card
              key={i.id}
              className={`overflow-hidden ${low ? "ring-2 ring-danger/40" : ""}`}
            >
              <div className="flex gap-3 p-3">
                <img
                  src={imgFor(i.name)}
                  alt=""
                  className="h-16 w-16 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-semibold text-ink">{i.name}</div>
                    <div className={`text-sm font-bold tabular ${low ? "text-danger" : ""}`}>
                      {i.stock} {i.unit}
                    </div>
                  </div>
                  <div className="mt-0.5 text-xs text-muted">
                    Seuil: {i.minStock ?? 0} {i.unit}
                    {low ? " · Stock bas" : ""}
                  </div>
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm font-medium text-brand">
                      Modifier
                    </summary>
                    <EditForm item={i} />
                  </details>
                </div>
              </div>
            </Card>
          );
        })}
      </ul>

      <Card className="p-4">
        <h2 className="font-semibold">Ajouter</h2>
        <EditForm />
      </Card>
    </div>
  );
}

function EditForm({ item }: { item?: { id: string; name: string; unit: string; stock: number; minStock?: number } }) {
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await addOrUpdate({
      id: String(fd.get("id") || "") || undefined,
      name: String(fd.get("name") || ""),
      unit: String(fd.get("unit") || ""),
      stock: Number(fd.get("stock") || 0),
      minStock: Number(fd.get("minStock") || 0),
    });
    e.currentTarget.reset();
  }
  return (
    <form onSubmit={onSubmit} className="mt-3 grid grid-cols-2 gap-2">
      <input type="hidden" name="id" defaultValue={item?.id ?? ""} />
      <Field label="Nom" className="col-span-2">
        <input name="name" defaultValue={item?.name ?? ""} className={inputClass} placeholder="Papier A4…" required />
      </Field>
      <Field label="Unité">
        <input name="unit" defaultValue={item?.unit ?? ""} className={inputClass} placeholder="ramette" />
      </Field>
      <Field label="Stock">
        <input name="stock" type="number" defaultValue={item?.stock ?? 0} className={inputClass} />
      </Field>
      <Field label="Seuil bas" className="col-span-2">
        <input name="minStock" type="number" defaultValue={item?.minStock ?? 0} className={inputClass} />
      </Field>
      <Button type="submit" block className="col-span-2">
        Enregistrer
      </Button>
    </form>
  );
}
