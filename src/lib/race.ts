import { YARD_DISTANCE_KM } from "./constants";
import type { Yard, RaceConfig, RunnerStatus, RaceFinished } from "./types";

export function getRunnerStatus(
  config: RaceConfig,
  finished: RaceFinished
): RunnerStatus {
  if (finished.isFinished) return "finished";
  if (!config.startDate || !config.startTime) return "not_started";

  const startMs = getRaceStartMs(config);
  if (Date.now() >= startMs) return "in_progress";
  return "not_started";
}

function parseLocalInTimezone(dateStr: string, timeStr: string, tz: string): number {
  // Normalize timeStr to always include seconds
  const time = timeStr.length === 5 ? timeStr + ":00" : timeStr;
  // Parse as UTC first to get a reference point
  const refMs = Date.parse(`${dateStr}T${time}Z`);
  // Find what `tz` displays for that UTC moment
  const tzStr = new Intl.DateTimeFormat("sv-SE", {
    timeZone: tz,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false,
  }).format(new Date(refMs)).replace(" ", "T");
  // Shift by the difference to land on the correct UTC instant
  return refMs + (refMs - Date.parse(tzStr + "Z"));
}

export function lastYardElapsed(yards: Yard[], config: RaceConfig): string {
  const sorted = sortYards(yards);
  const last = sorted[sorted.length - 1];
  if (!last) return "00:00:00";
  const yardMs = parseLocalInTimezone(last.date, last.time, config.timezone || "UTC");
  const raceStartMs = getRaceStartMs(config);
  return formatDuration(Math.max(0, yardMs - raceStartMs));
}

export function formatYardTime(yard: Yard, timezone: string): string {
  const ms = parseLocalInTimezone(yard.date, yard.time, timezone);
  const date = new Date(ms);
  const dateParts = new Intl.DateTimeFormat("sv-SE", {
    timeZone: timezone,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (type: string) => dateParts.find(p => p.type === type)?.value ?? "";
  const tzAbbr = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    timeZoneName: "short",
  }).formatToParts(date).find(p => p.type === "timeZoneName")?.value ?? timezone;
  return `${get("year")}-${get("month")}-${get("day")} @ ${get("hour")}:${get("minute")}:${get("second")} ${tzAbbr}`;
}

export function getRaceStartMs(config: RaceConfig): number {
  if (!config.startDate || !config.startTime) return Infinity;
  return parseLocalInTimezone(config.startDate, config.startTime, config.timezone || "UTC");
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function formatPace(durationMs: number): string {
  const totalMinutes = durationMs / 1000 / 60;
  const pacePerKm = totalMinutes / YARD_DISTANCE_KM;
  const totalPaceSeconds = Math.round(pacePerKm * 60);
  const paceMinutes = Math.floor(totalPaceSeconds / 60);
  const paceSeconds = totalPaceSeconds % 60;
  return `${paceMinutes}:${String(paceSeconds).padStart(2, "0")}`;
}

export function calculateYardDuration(
  yardDate: string,
  yardTime: string,
  config: RaceConfig
): { duration: string; pace: string } {
  const yardMs = parseLocalInTimezone(yardDate, yardTime, config.timezone || "UTC");
  const raceStartMs = getRaceStartMs(config);

  const elapsed = yardMs - raceStartMs;
  const hourMs = 3600 * 1000;
  const completedHours = Math.floor(elapsed / hourMs);
  const lastHourMarkMs = raceStartMs + completedHours * hourMs;

  const durationMs = yardMs - lastHourMarkMs;
  return {
    duration: formatDuration(durationMs),
    pace: formatPace(durationMs),
  };
}

export function sortYards(yards: Yard[]): Yard[] {
  return [...yards].sort((a, b) => {
    const aMs = new Date(`${a.date}T${a.time}`).getTime();
    const bMs = new Date(`${b.date}T${b.time}`).getTime();
    return aMs - bMs;
  });
}

export function recalculateYards(yards: Yard[], config: RaceConfig): Yard[] {
  const sorted = sortYards(yards);
  return sorted.map((yard, idx) => {
    const { duration, pace } = calculateYardDuration(yard.date, yard.time, config);
    return {
      ...yard,
      yardCount: idx + 1,
      duration,
      pace,
      cumulativeKm: parseFloat(((idx + 1) * YARD_DISTANCE_KM).toFixed(2)),
    };
  });
}

export function statusLabel(status: RunnerStatus): string {
  switch (status) {
    case "not_started":
      return "Not Started";
    case "in_progress":
      return "In Progress";
    case "finished":
      return "Finished";
  }
}
