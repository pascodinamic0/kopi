"use client";
import { db } from "@/lib/db";
import { dualForRate, formatFC } from "@/lib/money";
import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { motion } from "motion/react";
import {
  AlertTriangle,
  Briefcase,
  Package,
  Plus,
  Settings,
  Wallet,
} from "lucide-react";
import { Card, NavTile, StatCard } from "@/components/ui";
import { SyncChip } from "@/components/SyncChip";
import { kickSync } from "@/lib/sync";
import { useEffect } from "react";

export default function Home() {
  const settings = useLiveQuery(() => db.settings.get("settings"), []);
  const jobs = useLiveQuery(() => db.jobs.toArray(), []);
  const payments = useLiveQuery(() => db.payments.toArray(), []);
  const consumables = useLiveQuery(() => db.consumables.toArray(), []);

  useEffect(() => {
    void kickSync();
  }, []);

  const today = new Date();
  const dayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  ).getTime();

  const todaysJobs = (jobs ?? []).filter((j) => j.createdAt >= dayStart);
  const todaysPayments = (payments ?? []).filter((p) => p.createdAt >= dayStart);
  const revenueFC = todaysPayments.reduce((s, p) => s + p.amountFC, 0);
  const byMethod = ["cash", "mpesa", "airtel", "orange"].map((m) => ({
    m,
    total: todaysPayments
      .filter((p) => p.method === m)
      .reduce((s, p) => s + p.amountFC, 0),
  }));
  const unpaidFC = (jobs ?? []).reduce(
    (s, j) => s + Math.max(0, j.totalFC - j.paidFC),
    0
  );
  const lowStock = (consumables ?? []).filter(
    (c) => c.minStock !== undefined && c.stock <= (c.minStock ?? 0)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted">Tableau de bord</p>
        <SyncChip />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#8b5cf6] via-[#7c3aed] to-[#4c1d95] p-5 text-white shadow-soft sm:p-7"
      >
        <div className="print-mesh pointer-events-none absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute -right-10 -top-6 h-44 w-56 overflow-hidden rounded-2xl opacity-40">
          <img
            src="/img/hero.jpg"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <p className="text-sm font-medium text-white/80">
            Mbote, {settings?.shopName ?? "ami"} 👋
          </p>
          <p className="mt-3 text-[13px] font-semibold uppercase tracking-wider text-white/70">
            Ventes d&apos;aujourd&apos;hui
          </p>
          <p className="mt-1 text-[38px] font-extrabold leading-none tracking-tight tabular sm:text-5xl">
            {formatFC(revenueFC)}
          </p>
          <p className="mt-2 text-sm font-medium text-white/80 tabular">
            {dualForRate(revenueFC, settings?.fxRateUsd ?? 2800)}
          </p>
          <div className="mt-5">
            <Link
              href="/jobs/new"
              className="inline-flex h-12 items-center gap-2 rounded-2xl bg-white px-5 text-[15px] font-bold text-[#6d28d9] shadow-lg transition active:scale-95"
            >
              <Plus size={19} /> Nouvelle commande
            </Link>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-wrap gap-2">
        {byMethod.map(({ m, total }) => (
          <span
            key={m}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/90 px-3 py-1.5 text-xs font-medium shadow-sm backdrop-blur"
          >
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{
                background:
                  m === "cash"
                    ? "#1a1228"
                    : m === "mpesa"
                      ? "#22c55e"
                      : m === "airtel"
                        ? "#ef4444"
                        : "#f59e0b",
              }}
            />
            <span className="capitalize">{m}</span>
            <span className="tabular text-muted">{formatFC(total)}</span>
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Travaux du jour"
          value={todaysJobs.length}
          icon={<Briefcase size={16} />}
          tone="info"
        />
        <StatCard
          label="Impayés"
          value={formatFC(unpaidFC)}
          sub={dualForRate(unpaidFC, settings?.fxRateUsd ?? 2800)}
          icon={<Wallet size={16} />}
          tone="gold"
        />
        <StatCard
          label="Stock bas"
          value={lowStock.length}
          icon={<AlertTriangle size={16} />}
          tone={lowStock.length ? "danger" : "ok"}
        />
        <StatCard
          label="Services"
          value={settings?.services.length ?? 0}
          icon={<Package size={16} />}
          tone="default"
        />
      </div>

      {settings?.mode === "demo" ? (
        <Card className="border-amber-300/60 bg-amber-50 p-4 text-amber-950">
          Mode démo: données fictives de <strong>Kopi Gombe</strong>.{" "}
          <Link href="/settings/live" className="font-semibold underline">
            Passer en production
          </Link>
        </Card>
      ) : null}

      <div className="grid grid-cols-2 gap-3">
        <NavTile
          href="/jobs"
          title="Travaux"
          subtitle="Pipeline & paiements"
          image="/img/printer.jpg"
        />
        <NavTile
          href="/stock"
          title="Consommables"
          subtitle="Papier, toner, bâche"
          image="/img/paper.jpg"
        />
        <NavTile
          href="/credit"
          title="Crédit clients"
          subtitle="Impayés & relances"
          image="/img/business-cards.jpg"
        />
        <NavTile
          href="/settings"
          title="Paramètres"
          subtitle="Tarifs, FX, boutique"
          image="/img/cybercafe.jpg"
        />
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
          Atelier
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {[
            { src: "/img/photocopy.jpg", label: "Photocopie" },
            { src: "/img/bache.jpg", label: "Bâches" },
            { src: "/img/desk.jpg", label: "Cybercafé" },
          ].map((x) => (
            <div
              key={x.label}
              className="overflow-hidden rounded-2xl border border-line shadow-sm"
            >
              <img src={x.src} alt={x.label} className="h-20 w-full object-cover" />
              <p className="bg-surface px-2 py-1.5 text-center text-[11px] font-medium text-muted">
                {x.label}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
