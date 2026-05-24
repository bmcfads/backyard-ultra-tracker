"use client";

import { useEffect, useState } from "react";
import { formatDuration, getRaceStartMs, lastLoopElapsed } from "@/lib/race";
import type { RaceConfig, RaceFinished, Loop } from "@/lib/types";

function useNow(active: boolean): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, [active]);

  return now;
}

interface CountdownTimerProps {
  config: RaceConfig;
  finished: RaceFinished;
}

export function CountdownTimer({ config, finished }: CountdownTimerProps) {
  const raceStartMs = getRaceStartMs(config);
  const isActive = !finished.isFinished;
  const now = useNow(isActive);

  if (finished.isFinished) {
    return <span className="tabular-nums">00:00:00</span>;
  }

  if (now < raceStartMs) {
    const diff = raceStartMs - now;
    return <span className="tabular-nums">{formatDuration(diff)}</span>;
  }

  // Count down to the next hour mark since race start
  const elapsed = now - raceStartMs;
  const hourMs = 3600 * 1000;
  const nextHourMarkMs = raceStartMs + (Math.floor(elapsed / hourMs) + 1) * hourMs;
  const diff = nextHourMarkMs - now;
  return <span className="tabular-nums">{formatDuration(diff)}</span>;
}

interface ElapsedTimerProps {
  config: RaceConfig;
  finished: RaceFinished;
  loops: Loop[];
}

export function ElapsedTimer({ config, finished, loops }: ElapsedTimerProps) {
  const raceStartMs = getRaceStartMs(config);
  const isActive = !finished.isFinished && raceStartMs !== Infinity;
  const now = useNow(isActive);

  if (!config.startDate || !config.startTime) {
    return <span className="tabular-nums">00:00:00</span>;
  }

  if (finished.isFinished) {
    return <span className="tabular-nums">{lastLoopElapsed(loops, config)}</span>;
  }

  if (now < raceStartMs) {
    return <span className="tabular-nums">00:00:00</span>;
  }

  const elapsed = now - raceStartMs;
  return <span className="tabular-nums">{formatDuration(elapsed)}</span>;
}
