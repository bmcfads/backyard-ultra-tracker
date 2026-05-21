import { NextResponse } from "next/server";
import { getRaceData } from "@/lib/kv";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getRaceData();
  return NextResponse.json(data);
}
