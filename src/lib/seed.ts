import { db } from "./db";
import type { Client, Consumable, Job, JobItem, Payment, Service, Settings, User } from "./types";

const now = () => Date.now();
const uid = () => crypto.randomUUID();

export async function seedDemoData() {
  const services: Service[] = [
    { id: uid(), name: "Photocopie N&B A4", unit: "page", priceFC: 200, active: true },
    { id: uid(), name: "Impression couleur A4", unit: "page", priceFC: 800, active: true },
    { id: uid(), name: "Cartes de visite", unit: "pièce", priceFC: 1200, active: true },
    { id: uid(), name: "Flyers", unit: "pièce", priceFC: 500, active: true },
    { id: uid(), name: "Bâche", unit: "mètre", priceFC: 12000, active: true },
    { id: uid(), name: "Plastification", unit: "pièce", priceFC: 1500, active: true },
    { id: uid(), name: "Reliure", unit: "pièce", priceFC: 2500, active: true },
    { id: uid(), name: "Saisie CV", unit: "page", priceFC: 1500, active: true },
  ];

  const settings: Settings = {
    id: "settings",
    shopName: "Kopi Gombe",
    commune: "Gombe",
    fxRateUsd: 2800,
    mode: "demo",
    demoBanner: true,
    mobileMoney: {},
    services,
    createdAt: now(),
    updatedAt: now(),
  };

  const clients: Client[] = [
    { id: uid(), fullName: "M. Kabasele", debtFC: 0, createdAt: now() },
    { id: uid(), fullName: "Mme Tshibola", debtFC: 0, createdAt: now() },
    { id: uid(), fullName: "Frère Patrick", debtFC: 0, createdAt: now() },
  ];

  const job1Items: JobItem[] = [
    { id: uid(), serviceId: services[0].id, quantity: 30, unitPriceFC: 200 },
    { id: uid(), serviceId: services[5].id, quantity: 2, unitPriceFC: 1500 },
  ];
  const total1 = job1Items.reduce((s, it) => s + it.quantity * it.unitPriceFC, 0);
  const job1: Job = {
    id: uid(),
    ref: "KG-001",
    clientId: clients[0].id,
    items: job1Items,
    totalFC: total1,
    paidFC: 2000,
    status: "en_cours",
    createdAt: now() - 1000 * 60 * 60,
    updatedAt: now(),
  };

  const job2Items: JobItem[] = [
    { id: uid(), serviceId: services[2].id, quantity: 100, unitPriceFC: 1200 },
  ];
  const total2 = job2Items.reduce((s, it) => s + it.quantity * it.unitPriceFC, 0);
  const job2: Job = {
    id: uid(),
    ref: "KG-002",
    clientName: "Eglise La Foi",
    items: job2Items,
    totalFC: total2,
    paidFC: 0,
    status: "recu",
    createdAt: now() - 1000 * 60 * 30,
    updatedAt: now(),
  };

  const payments: Payment[] = [
    { id: uid(), jobId: job1.id, method: "cash", amountFC: 2000, createdAt: now() - 1000 * 60 * 30 },
  ];

  const consumables: Consumable[] = [
    { id: uid(), name: "Papier A4 (ramette 500)", unit: "ramette", stock: 12, minStock: 5 },
    { id: uid(), name: "Toner HP 12A", unit: "cartouche", stock: 2, minStock: 2 },
    { id: uid(), name: "Bâche 440g", unit: "mètre", stock: 15, minStock: 5 },
  ];

  const users: User[] = [
    { id: uid(), name: "Super Admin", role: "super_admin", createdAt: now() },
    { id: uid(), name: "Maman Kopi", role: "owner", createdAt: now() },
    { id: uid(), name: "Junior", role: "staff", createdAt: now() },
  ];

      await db.settings.put(settings);
    await db.clients.bulkAdd(clients);
    await db.jobs.bulkAdd([job1, job2]);
    await db.payments.bulkAdd(payments);
    await db.consumables.bulkAdd(consumables);
    await db.users.bulkAdd(users);

}

export async function purgeDemoForProduction() {
  // Remove everything except keep settings shell then set mode to production.
      await db.jobs.clear();
    await db.clients.clear();
    await db.payments.clear();
    // Leave consumables empty; onboarding will set them up
    await db.consumables.clear();
    await db.users.clear();
    const s = await db.settings.get("settings");
    const updated: Settings =
      s
        ? { ...s, mode: "production", demoBanner: false, createdAt: s.createdAt, updatedAt: now() }
        : {
            id: "settings",
            shopName: "",
            commune: "",
            fxRateUsd: 2800,
            mode: "production",
            demoBanner: false,
            mobileMoney: {},
            services: [],
            createdAt: now(),
            updatedAt: now(),
          };
    await db.settings.put(updated);

}

