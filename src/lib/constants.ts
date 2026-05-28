export const YARD_DISTANCE_KM = 6.706;

export const KV_KEYS = {
  config: "race:config",
  finished: "race:finished",
  yards: "race:yards",
  youtubePlaylistId: "race:youtubePlaylistId",
} as const;

export const DEFAULT_CONFIG = {
  title: "",
  location: "",
  startDate: "",
  startTime: "",
  timezone: "UTC",
  subtitle: "",
  summary: "",
};

export const COMMON_TIMEZONES = [
  "UTC",
  "America/St_Johns",
  "America/Halifax",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Phoenix",
  "America/Los_Angeles",
  "America/Anchorage",
  "Pacific/Honolulu",
  "America/Toronto",
  "America/Vancouver",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Helsinki",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
  "Pacific/Auckland",
] as const;
