export type MoneyFC = number;

export type Currency = "FC" | "USD";

export type PaymentMethod = "cash" | "mpesa" | "airtel" | "orange";

export type JobStatus = "recu" | "en_cours" | "pret" | "livre";

export interface Service {
  id: string;
  name: string; // e.g., "Photocopie", "Impression A4", "Cartes de visite"
  unit: string; // "page", "pièce", "mètre", etc.
  priceFC: MoneyFC; // price per unit in Congolese Franc (FC)
  priceUSD?: number; // optional explicit USD price; if omitted use fxRate
  active: boolean;
}

export interface Client {
  id: string;
  fullName: string;
  phone?: string;
  debtFC: MoneyFC;
  createdAt: number;
}

export interface JobItem {
  id: string;
  serviceId: string;
  quantity: number;
  unitPriceFC: MoneyFC;
  note?: string;
}

export interface Job {
  id: string;
  ref: string;
  clientId?: string;
  clientName?: string;
  items: JobItem[];
  totalFC: MoneyFC;
  paidFC: MoneyFC;
  status: JobStatus;
  createdAt: number;
  updatedAt: number;
}

export interface Payment {
  id: string;
  jobId?: string;
  clientId?: string;
  method: PaymentMethod;
  amountFC: MoneyFC;
  createdAt: number;
}

export interface Consumable {
  id: string;
  name: string;
  unit: string; // "ramette", "cartouche", "mètre"
  stock: number;
  minStock?: number;
}

export interface Settings {
  id: "settings";
  shopName: string;
  commune?: string;
  fxRateUsd: number; // 1 USD in FC
  mode: "demo" | "production";
  demoBanner: boolean;
  mobileMoney: {
    mpesa?: string;
    airtel?: string;
    orange?: string;
  };
  services: Service[];
  createdAt: number;
  updatedAt: number;
}

export interface User {
  id: string;
  name: string;
  role: "super_admin" | "owner" | "staff";
  createdAt: number;
}

