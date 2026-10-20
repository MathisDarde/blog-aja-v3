import { NextRequest, NextResponse } from "next/server";
import { publishDueDrafts } from "@/lib/scheduled-publish";

export const dynamic = "force-dynamic";

// Appelée toutes les 5 minutes par .github/workflows/publish-scheduled.yml
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (
    !secret ||
    request.headers.get("authorization") !== `Bearer ${secret}`
  ) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const result = await publishDueDrafts();
  return NextResponse.json(result, {
    status: result.failed.length > 0 ? 500 : 200,
  });
}
