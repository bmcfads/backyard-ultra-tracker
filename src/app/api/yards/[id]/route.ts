import { NextRequest, NextResponse } from "next/server";
import { setYards } from "@/lib/kv";
import { getRaceData } from "@/lib/kv";
import { recalculateYards } from "@/lib/race";

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
  const { config, yards } = await getRaceData();

  const updated = yards.map((yard) =>
    yard.id === id ? { ...yard, ...updates } : yard
  );

  const recalculated = recalculateYards(updated, config);
  await setYards(recalculated);

  return NextResponse.json({ ok: true, yards: recalculated });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { config, yards } = await getRaceData();

  const filtered = yards.filter((yard) => yard.id !== id);
  const recalculated = recalculateYards(filtered, config);
  await setYards(recalculated);

  return NextResponse.json({ ok: true, yards: recalculated });
}
