import { NextRequest, NextResponse } from "next/server";
import { getYards, setYards } from "@/lib/kv";
import { getRaceData } from "@/lib/kv";
import { recalculateYards, sortYards } from "@/lib/race";
import { YARD_DISTANCE_KM } from "@/lib/constants";
import { v4 as uuidv4 } from "uuid";
import type { Yard } from "@/lib/types";

function isAuthorized(req: NextRequest): boolean {
  const auth = req.headers.get("x-admin-auth");
  return auth === process.env.ADMIN_PASSWORD;
}

export async function GET() {
  const yards = await getYards();
  return NextResponse.json(sortYards(yards));
}

// Add a yard (manual or via "Yard Completed" button)
export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { date, time, auto } = body;

  const { config, yards: existingYards } = await getRaceData();

  let yardDate = date;
  let yardTime = time;

  if (auto) {
    const now = new Date();
    const tz = config.timezone || "UTC";
    const parts = new Intl.DateTimeFormat("sv-SE", {
      timeZone: tz,
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
      hour12: false,
    }).format(now);
    // sv-SE format: "2024-06-15 08:00:00"
    yardDate = parts.slice(0, 10);
    yardTime = parts.slice(11, 19);
  }

  const sorted = sortYards(existingYards);
  const lastYard = sorted[sorted.length - 1];
  const prevCumulativeKm = lastYard ? lastYard.cumulativeKm : 0;

  const newYard: Yard = {
    id: uuidv4(),
    yardCount: sorted.length + 1,
    date: yardDate,
    time: yardTime,
    duration: "00:00:00",
    pace: "0:00",
    cumulativeKm: parseFloat((prevCumulativeKm + YARD_DISTANCE_KM).toFixed(2)),
  };

  const allYards = [...existingYards, newYard];
  const recalculated = recalculateYards(allYards, config);

  await setYards(recalculated);
  return NextResponse.json({ ok: true, yards: recalculated });
}
