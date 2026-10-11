import { NextResponse } from "next/server";

/** Server placeholder — real QA runs in the browser via runQAChecks (Dexie). */
export async function GET() {
  return NextResponse.json({
    ok: true,
    note: "QA runs client-side with Dexie. Use Passer en production in Settings.",
  });
}
