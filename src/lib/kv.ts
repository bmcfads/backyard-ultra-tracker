import { kv } from "@vercel/kv";
import { KV_KEYS, DEFAULT_CONFIG } from "./constants";
import type { RaceConfig, Loop, VideoMode, RaceFinished, RaceData } from "./types";

export async function getRaceData(): Promise<RaceData> {
  const [config, finished, loops, videoMode, tiktokUsername, videos] =
    await Promise.all([
      kv.get<RaceConfig>(KV_KEYS.config),
      kv.get<RaceFinished>(KV_KEYS.finished),
      kv.get<Loop[]>(KV_KEYS.loops),
      kv.get<VideoMode>(KV_KEYS.videoMode),
      kv.get<string>(KV_KEYS.tiktokUsername),
      kv.get<string[]>(KV_KEYS.videos),
    ]);

  return {
    config: config ?? { ...DEFAULT_CONFIG },
    finished: finished ?? { isFinished: false },
    loops: loops ?? [],
    videoMode: videoMode ?? "profile",
    tiktokUsername: tiktokUsername ?? "",
    videos: videos ?? [],
  };
}

export async function setConfig(config: RaceConfig): Promise<void> {
  await kv.set(KV_KEYS.config, config);
}

export async function setFinished(finished: RaceFinished): Promise<void> {
  await kv.set(KV_KEYS.finished, finished);
}

export async function getLoops(): Promise<Loop[]> {
  const loops = await kv.get<Loop[]>(KV_KEYS.loops);
  return loops ?? [];
}

export async function setLoops(loops: Loop[]): Promise<void> {
  await kv.set(KV_KEYS.loops, loops);
}

export async function setVideoMode(mode: VideoMode): Promise<void> {
  await kv.set(KV_KEYS.videoMode, mode);
}

export async function setTikTokUsername(username: string): Promise<void> {
  await kv.set(KV_KEYS.tiktokUsername, username);
}

export async function setVideos(videos: string[]): Promise<void> {
  await kv.set(KV_KEYS.videos, videos);
}
