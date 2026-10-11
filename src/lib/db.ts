import Dexie, { Table } from "dexie";
import type {
  Client,
  Consumable,
  Job,
  Payment,
  Settings,
  User,
} from "./types";

export class KopiDB extends Dexie {
  jobs!: Table<Job, string>;
  clients!: Table<Client, string>;
  payments!: Table<Payment, string>;
  consumables!: Table<Consumable, string>;
  settings!: Table<Settings, string>;
  users!: Table<User, string>;

  constructor() {
    super("kopi-db");
    this.version(1).stores({
      jobs: "id, status, createdAt, updatedAt",
      clients: "id, fullName, createdAt",
      payments: "id, jobId, clientId, createdAt",
      consumables: "id, name",
      settings: "id",
      users: "id, role",
    });
  }
}

export const db = new KopiDB();

export async function resetAllForDemo() {
  await Promise.all([
    db.jobs.clear(),
    db.clients.clear(),
    db.payments.clear(),
    db.consumables.clear(),
    db.settings.clear(),
    db.users.clear(),
  ]);
}

export const isBrowser = typeof window !== "undefined";

