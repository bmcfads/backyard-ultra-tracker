import { Redis } from "@upstash/redis";
import { KV_KEYS, DEFAULT_CONFIG } from "./constants";
import type { RaceConfig, Loop, RaceFinished, RaceData } from "./types";

const kv = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export async function getRaceData(): Promise<RaceData> {
  const [config, finished, loops, youtubePlaylistId] = await Promise.all([
    kv.get<RaceConfig>(KV_KEYS.config),
    kv.get<RaceFinished>(KV_KEYS.finished),
    kv.get<Loop[]>(KV_KEYS.loops),
    kv.get<string>(KV_KEYS.youtubePlaylistId),
  ]);

  return {
    config: config ?? { ...DEFAULT_CONFIG },
    finished: finished ?? { isFinished: false },
    loops: loops ?? [],
    youtubePlaylistId: youtubePlaylistId ?? "",
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

export async function setYouTubePlaylistId(playlistId: string): Promise<void> {
  await kv.set(KV_KEYS.youtubePlaylistId, playlistId);
}
