import type { Settings } from "./types";
import { db } from "./db";

export function formatFC(amount: number) {
  return new Intl.NumberFormat("fr-CD", { style: "currency", currency: "CDF", currencyDisplay: "narrowSymbol", maximumFractionDigits: 0 }).format(amount);
}

export function formatUSD(amount: number) {
  return new Intl.NumberFormat("fr-CD", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(amount);
}

export async function dual(amountFC: number) {
  const s = (await db.settings.get("settings")) as Settings | undefined;
  const rate = s?.fxRateUsd ?? 2800;
  const usd = amountFC / rate;
  return `${formatFC(amountFC)} · ≈ ${formatUSD(usd)}`;
}

export function dualForRate(amountFC: number, rate: number) {
  const usd = amountFC / (rate || 2800);
  return `${formatFC(amountFC)} · ≈ ${formatUSD(usd)}`;
}

