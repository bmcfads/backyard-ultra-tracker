"use client";

import { useState } from "react";
import { RaceConfigForm } from "./RaceConfigForm";
import { LoopManager } from "./LoopManager";
import { VideoManager } from "./VideoManager";
import type { RaceData } from "@/lib/types";
import { getRaceStartMs, formatDuration } from "@/lib/race";

interface AdminDashboardProps {
  data: RaceData;
  password: string;
  onRefresh: () => Promise<void>;
}

export function AdminDashboard({ data, password, onRefresh }: AdminDashboardProps) {
  const [finishing, setFinishing] = useState(false);
  const raceStartMs = getRaceStartMs(data.config);

  function getCurrentElapsed(): string {
    const now = Date.now();
    if (now < raceStartMs) return "00:00:00";
    return formatDuration(now - raceStartMs);
  }

  async function toggleFinish() {
    setFinishing(true);
    const isFinishing = !data.finished.isFinished;
    const elapsedSnapshot = isFinishing ? getCurrentElapsed() : undefined;

    await fetch("/api/finish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-auth": password,
      },
      body: JSON.stringify({ isFinished: isFinishing, elapsedSnapshot }),
    });

    await onRefresh();
    setFinishing(false);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="mb-8 text-center">Admin</h1>

      <RaceConfigForm config={data.config} password={password} onRefresh={onRefresh} />

      <div className="my-8 border-t border-border" />

      <button
        onClick={toggleFinish}
        disabled={finishing}
        className={`w-full py-3 px-4 rounded text-sm transition-colors ${
          data.finished.isFinished
            ? "bg-muted/30 text-muted border border-border hover:bg-muted/40"
            : "bg-red-700 hover:bg-red-800 text-white"
        }`}
      >
        {finishing
          ? "..."
          : data.finished.isFinished
          ? "Race Finished (click to undo)"
          : "Finish Race"}
      </button>

      <div className="my-8 border-t border-border" />

      <LoopManager
        loops={data.loops}
        password={password}
        onRefresh={onRefresh}
      />

      <div className="my-8 border-t border-border" />

      <VideoManager
        videoMode={data.videoMode}
        tiktokUsername={data.tiktokUsername}
        videos={data.videos}
        password={password}
        onRefresh={onRefresh}
      />
    </div>
  );
}
