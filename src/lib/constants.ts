export const LOOP_DISTANCE_KM = 6.706;

export const KV_KEYS = {
  config: "race:config",
  finished: "race:finished",
  loops: "race:loops",
  videoMode: "race:videoMode",
  tiktokUsername: "race:tiktokUsername",
  videos: "race:videos",
} as const;

export const DEFAULT_CONFIG = {
  title: "",
  location: "",
  startDate: "",
  startTime: "",
  summary: "",
};
