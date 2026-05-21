import { NextRequest, NextResponse } from "next/server";
import { setConfig } from "@/lib/kv";
import type { RaceConfig } from "@/lib/types";

function isAuthorized(req: NextRequest): boolean {
  const auth = req.headers.get("x-admin-auth");
  return auth === process.env.ADMIN_PASSWORD;
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const config: RaceConfig = await req.json();

  if (!config.title || !config.startDate || !config.startTime) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  await setConfig(config);
  return NextResponse.json({ ok: true });
}
