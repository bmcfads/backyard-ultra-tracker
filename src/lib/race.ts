import { LOOP_DISTANCE_KM } from "./constants";
import type { Loop, RaceConfig, RunnerStatus, RaceFinished } from "./types";

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

export function getRaceStartMs(config: RaceConfig): number {
  if (!config.startDate || !config.startTime) return Infinity;
  return new Date(`${config.startDate}T${config.startTime}:00`).getTime();
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
  const pacePerKm = totalMinutes / LOOP_DISTANCE_KM;
  const paceMinutes = Math.floor(pacePerKm);
  const paceSeconds = Math.round((pacePerKm - paceMinutes) * 60);
  return `${paceMinutes}:${String(paceSeconds).padStart(2, "0")}`;
}

export function calculateLoopDuration(
  loopDate: string,
  loopTime: string,
  config: RaceConfig
): { duration: string; pace: string } {
  const loopMs = new Date(`${loopDate}T${loopTime}`).getTime();
  const raceStartMs = getRaceStartMs(config);

  const elapsed = loopMs - raceStartMs;
  const hourMs = 3600 * 1000;
  const completedHours = Math.floor(elapsed / hourMs);
  const lastHourMarkMs = raceStartMs + completedHours * hourMs;

  const durationMs = loopMs - lastHourMarkMs;
  return {
    duration: formatDuration(durationMs),
    pace: formatPace(durationMs),
  };
}

export function sortLoops(loops: Loop[]): Loop[] {
  return [...loops].sort((a, b) => {
    const aMs = new Date(`${a.date}T${a.time}`).getTime();
    const bMs = new Date(`${b.date}T${b.time}`).getTime();
    return aMs - bMs;
  });
}

export function recalculateLoops(loops: Loop[], config: RaceConfig): Loop[] {
  const sorted = sortLoops(loops);
  return sorted.map((loop, idx) => {
    const { duration, pace } = calculateLoopDuration(loop.date, loop.time, config);
    return {
      ...loop,
      loopCount: idx + 1,
      duration,
      pace,
      cumulativeKm: parseFloat(((idx + 1) * LOOP_DISTANCE_KM).toFixed(2)),
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
