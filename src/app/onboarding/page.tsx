"use client";
import { db } from "@/lib/db";
import Link from "next/link";

async function startClient(data: {
  shopName: string;
  commune: string;
  fxRateUsd: number;
}) {
  const s = (await db.settings.get("settings")) || {
    id: "settings",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    services: [],
    mode: "production",
    demoBanner: false,
    shopName: data.shopName,
    fxRateUsd: data.fxRateUsd,
    mobileMoney: {},
  };
  await db.settings.put({
    ...s,
    shopName: data.shopName,
    commune: data.commune,
    fxRateUsd: data.fxRateUsd,
    mode: "production",
    demoBanner: false,
    updatedAt: Date.now(),
  } as any);
  window.location.href = "/";
}

export default function OnboardingPage() {
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await startClient({
      shopName: String(fd.get("shopName") || ""),
      commune: String(fd.get("commune") || ""),
      fxRateUsd: Number(fd.get("fxRateUsd") || 2800),
    });
  }
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Bienvenue sur Kopi</h1>
      <p className="text-gray-600">
        Quelques détails pour démarrer votre boutique en production.
      </p>
      <form onSubmit={onSubmit} className="space-y-3 rounded border bg-white p-4">
        <div>
          <label className="text-sm text-gray-600">Nom de la boutique</label>
          <input
            name="shopName"
            className="mt-1 w-full rounded border p-2"
            placeholder="Ex: Imprimerie Mwana Mayi"
            required
          />
        </div>
        <div>
          <label className="text-sm text-gray-600">Commune</label>
          <input
            name="commune"
            className="mt-1 w-full rounded border p-2"
            placeholder="Ex: Gombe"
          />
        </div>
        <div>
          <label className="text-sm text-gray-600">Taux USD</label>
          <input
            name="fxRateUsd"
            type="number"
            defaultValue={2800}
            className="mt-1 w-full rounded border p-2"
            required
          />
        </div>
        <button
          type="submit"
          className="rounded bg-violet-600 px-4 py-2 text-white"
        >
          Continuer
        </button>
        <p className="text-sm text-gray-500">
          Vous pourrez ajouter vos services, prix, numéros Mobile Money et le
          personnel après cette étape.
        </p>
      </form>
      <Link href="/" className="text-sm text-violet-700 underline">
        Retour au tableau de bord
      </Link>
    </div>
  );
}

