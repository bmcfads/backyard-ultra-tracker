import { Redis } from "@upstash/redis";
import { KV_KEYS, DEFAULT_CONFIG } from "./constants";
import type { RaceConfig, Yard, RaceFinished, RaceData } from "./types";

const kv = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export async function getRaceData(): Promise<RaceData> {
  const [config, finished, yards, youtubePlaylistId] = await Promise.all([
    kv.get<RaceConfig>(KV_KEYS.config),
    kv.get<RaceFinished>(KV_KEYS.finished),
    kv.get<Yard[]>(KV_KEYS.yards),
    kv.get<string>(KV_KEYS.youtubePlaylistId),
  ]);

  return {
    config: config ?? { ...DEFAULT_CONFIG },
    finished: finished ?? { isFinished: false },
    yards: yards ?? [],
    youtubePlaylistId: youtubePlaylistId ?? "",
  };
}

export async function setConfig(config: RaceConfig): Promise<void> {
  await kv.set(KV_KEYS.config, config);
}

export async function setFinished(finished: RaceFinished): Promise<void> {
  await kv.set(KV_KEYS.finished, finished);
}

export async function getYards(): Promise<Yard[]> {
  const yards = await kv.get<Yard[]>(KV_KEYS.yards);
  return yards ?? [];
}

export async function setYards(yards: Yard[]): Promise<void> {
  await kv.set(KV_KEYS.yards, yards);
}

export async function setYouTubePlaylistId(playlistId: string): Promise<void> {
  await kv.set(KV_KEYS.youtubePlaylistId, playlistId);
}
