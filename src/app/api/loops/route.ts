import { NextRequest, NextResponse } from "next/server";
import { getLoops, setLoops } from "@/lib/kv";
import { getRaceData } from "@/lib/kv";
import { recalculateLoops, sortLoops } from "@/lib/race";
import { LOOP_DISTANCE_KM } from "@/lib/constants";
import { v4 as uuidv4 } from "uuid";
import type { Loop } from "@/lib/types";

function isAuthorized(req: NextRequest): boolean {
  const auth = req.headers.get("x-admin-auth");
  return auth === process.env.ADMIN_PASSWORD;
}

export async function GET() {
  const loops = await getLoops();
  return NextResponse.json(sortLoops(loops));
}

// Add a loop (manual or via "Loop Completed" button)
export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { date, time, auto } = body;

  const { config, loops: existingLoops } = await getRaceData();

  let loopDate = date;
  let loopTime = time;

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
    loopDate = parts.slice(0, 10);
    loopTime = parts.slice(11, 19);
  }

  const sorted = sortLoops(existingLoops);
  const lastLoop = sorted[sorted.length - 1];
  const prevCumulativeKm = lastLoop ? lastLoop.cumulativeKm : 0;

  const newLoop: Loop = {
    id: uuidv4(),
    loopCount: sorted.length + 1,
    date: loopDate,
    time: loopTime,
    duration: "00:00:00",
    pace: "0:00",
    cumulativeKm: parseFloat((prevCumulativeKm + LOOP_DISTANCE_KM).toFixed(2)),
  };

  const allLoops = [...existingLoops, newLoop];
  const recalculated = recalculateLoops(allLoops, config);

  await setLoops(recalculated);
  return NextResponse.json({ ok: true, loops: recalculated });
}
