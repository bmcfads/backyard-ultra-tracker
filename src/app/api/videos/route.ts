import { NextRequest, NextResponse } from "next/server";
import { setVideoMode, setTikTokUsername, setVideos } from "@/lib/kv";
import type { VideoMode } from "@/lib/types";

function isAuthorized(req: NextRequest): boolean {
  const auth = req.headers.get("x-admin-auth");
  return auth === process.env.ADMIN_PASSWORD;
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { videoMode, tiktokUsername, videos } = await req.json();

  await Promise.all([
    setVideoMode(videoMode as VideoMode),
    setTikTokUsername(tiktokUsername ?? ""),
    setVideos(videos ?? []),
  ]);

  return NextResponse.json({ ok: true });
}
