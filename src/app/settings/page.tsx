"use client";
import { db } from "@/lib/db";
import { useLiveQuery } from "dexie-react-hooks";
import { Button, Card, Field, inputClass } from "@/components/ui";
import { SyncChip } from "@/components/SyncChip";
import { kickSync } from "@/lib/sync";
import { isSupabaseConfigured } from "@/lib/supabase";
import Link from "next/link";

async function saveClient(data: {
  shopName: string;
  commune: string;
  fxRateUsd: number;
  mpesa?: string;
  airtel?: string;
  orange?: string;
}) {
  const s = (await db.settings.get("settings")) || {
    id: "settings" as const,
    createdAt: Date.now(),
    services: [],
    mode: "demo" as const,
    demoBanner: true,
    mobileMoney: {},
    fxRateUsd: data.fxRateUsd,
    shopName: data.shopName,
    updatedAt: Date.now(),
  };
  await db.settings.put({
    ...s,
    shopName: data.shopName,
    commune: data.commune,
    fxRateUsd: data.fxRateUsd,
    mobileMoney: { mpesa: data.mpesa, airtel: data.airtel, orange: data.orange },
    updatedAt: Date.now(),
  });
}

export default function SettingsPage() {
  const s = useLiveQuery(() => db.settings.get("settings"), []);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await saveClient({
      shopName: String(fd.get("shopName") || ""),
      commune: String(fd.get("commune") || ""),
      fxRateUsd: Number(fd.get("fxRateUsd") || 2800),
      mpesa: String(fd.get("mpesa") || ""),
      airtel: String(fd.get("airtel") || ""),
      orange: String(fd.get("orange") || ""),
    });
  }
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Paramètres</h1>
        <SyncChip />
      </div>

      <Card className="overflow-hidden">
        <img src="/img/cybercafe.jpg" alt="" className="h-24 w-full object-cover" />
        <form onSubmit={onSubmit} className="space-y-3 p-4">
          <Field label="Nom de la boutique">
            <input name="shopName" defaultValue={s?.shopName ?? ""} className={inputClass} placeholder="Ex: Kopi Gombe" />
          </Field>
          <Field label="Commune">
            <input name="commune" defaultValue={s?.commune ?? ""} className={inputClass} placeholder="Ex: Gombe" />
          </Field>
          <Field label="Taux USD (FC pour 1 $)">
            <input name="fxRateUsd" type="number" defaultValue={s?.fxRateUsd ?? 2800} className={inputClass} />
          </Field>
          <h2 className="pt-2 font-semibold">Mobile Money</h2>
          <div className="grid gap-2">
            <input name="mpesa" placeholder="M-Pesa" defaultValue={s?.mobileMoney?.mpesa ?? ""} className={inputClass} />
            <input name="airtel" placeholder="Airtel Money" defaultValue={s?.mobileMoney?.airtel ?? ""} className={inputClass} />
            <input name="orange" placeholder="Orange Money" defaultValue={s?.mobileMoney?.orange ?? ""} className={inputClass} />
          </div>
          <Button type="submit" block>
            Enregistrer
          </Button>
        </form>
      </Card>

      <Card className="space-y-3 p-4">
        <h2 className="font-semibold">Cloud (Supabase)</h2>
        <p className="text-sm text-muted">
          {isSupabaseConfigured()
            ? "Connecté — Dexie reste la source offline; Sync pousse/tire les données."
            : "Non configuré. Créez un projet Supabase « Kopi », appliquez supabase/migrations/001_kopi_schema.sql, puis renseignez .env.local."}
        </p>
        <Button variant="secondary" block onClick={() => kickSync()}>
          Synchroniser maintenant
        </Button>
      </Card>

      <Link href="/settings/live" className="block">
        <Button variant="soft" block>
          Passer en production
        </Button>
      </Link>
    </div>
  );
}
