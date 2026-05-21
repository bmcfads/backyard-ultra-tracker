import { NextRequest, NextResponse } from "next/server";
import { setFinished } from "@/lib/kv";

function isAuthorized(req: NextRequest): boolean {
  const auth = req.headers.get("x-admin-auth");
  return auth === process.env.ADMIN_PASSWORD;
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { isFinished, elapsedSnapshot } = await req.json();

  await setFinished({
    isFinished,
    finishedAt: isFinished ? new Date().toISOString() : undefined,
    elapsedSnapshot: isFinished ? elapsedSnapshot : undefined,
  });

  return NextResponse.json({ ok: true });
}
