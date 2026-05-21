import { NextRequest, NextResponse } from "next/server";
import { setLoops } from "@/lib/kv";
import { getRaceData } from "@/lib/kv";
import { recalculateLoops } from "@/lib/race";

function isAuthorized(req: NextRequest): boolean {
  const auth = req.headers.get("x-admin-auth");
  return auth === process.env.ADMIN_PASSWORD;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const updates = await req.json();
  const { config, loops } = await getRaceData();

  const updated = loops.map((loop) =>
    loop.id === id ? { ...loop, ...updates } : loop
  );

  const recalculated = recalculateLoops(updated, config);
  await setLoops(recalculated);

  return NextResponse.json({ ok: true, loops: recalculated });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { config, loops } = await getRaceData();

  const filtered = loops.filter((loop) => loop.id !== id);
  const recalculated = recalculateLoops(filtered, config);
  await setLoops(recalculated);

  return NextResponse.json({ ok: true, loops: recalculated });
}
