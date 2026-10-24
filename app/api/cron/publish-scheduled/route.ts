import { NextRequest, NextResponse } from "next/server";
import { publishDueDrafts } from "@/lib/scheduled-publish";
import { isQStashRequest } from "@/lib/scheduled-publish-trigger";

export const dynamic = "force-dynamic";

// Les horloges de QStash et de Vercel peuvent différer de quelques secondes :
// sans cette marge, un appel arrivé un poil trop tôt ne publierait rien.
const CLOCK_MARGIN_MS = 30_000;

async function run() {
  const result = await publishDueDrafts(new Date(Date.now() + CLOCK_MARGIN_MS));
  return NextResponse.json(result, {
    status: result.failed.length > 0 ? 500 : 200,
  });
}

function unauthorized() {
  return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
}

// Appel de QStash, programmé à l'heure exacte de chaque publication
// (lib/scheduled-publish-trigger.ts)
export async function POST(request: NextRequest) {
  const body = await request.text();
  if (!(await isQStashRequest(request.headers.get("upstash-signature"), body))) {
    return unauthorized();
  }
  return run();
}

// Filet de sécurité : .github/workflows/publish-scheduled.yml, quand GitHub veut bien
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (
    !secret ||
    request.headers.get("authorization") !== `Bearer ${secret}`
  ) {
    return unauthorized();
  }
  return run();
}
