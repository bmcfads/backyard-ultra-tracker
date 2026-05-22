export interface RaceConfig {
  title: string;
  location: string;
  startDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM (24h)
  summary: string;
}

export interface Loop {
  id: string;
  loopCount: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM:SS
  duration: string; // HH:MM:SS
  pace: string; // M:SS /km
  cumulativeKm: number;
}

export type RunnerStatus = "not_started" | "in_progress" | "finished";

export interface RaceFinished {
  isFinished: boolean;
  finishedAt?: string; // ISO string
  elapsedSnapshot?: string; // HH:MM:SS elapsed at finish time
}

export interface RaceData {
  config: RaceConfig;
  finished: RaceFinished;
  loops: Loop[];
  youtubePlaylistId: string;
}
