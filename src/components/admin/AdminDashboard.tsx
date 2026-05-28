"use client";

import { useState } from "react";
import { RaceConfigForm } from "./RaceConfigForm";
import { YardManager } from "./YardManager";
import { VideoManager } from "./VideoManager";
import type { RaceData } from "@/lib/types";
import { getRaceStartMs, formatDuration, lastYardElapsed } from "@/lib/race";

interface AdminDashboardProps {
  data: RaceData;
  password: string;
  onRefresh: () => Promise<void>;
}

export function AdminDashboard({ data, password, onRefresh }: AdminDashboardProps) {
  const [finishing, setFinishing] = useState(false);
  const [yardBusy, setYardBusy] = useState(false);
  const [subtitle, setSubtitle] = useState(data.config.subtitle || "");
  const [subtitleSaving, setSubtitleSaving] = useState(false);
  const [subtitleSaved, setSubtitleSaved] = useState(false);
  const raceStartMs = getRaceStartMs(data.config);

  function getCurrentElapsed(): string {
    const now = Date.now();
    if (now < raceStartMs) return "00:00:00";
    return formatDuration(now - raceStartMs);
  }

  async function handleYardCompleted() {
    setYardBusy(true);
    await fetch("/api/yards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-auth": password,
      },
      body: JSON.stringify({ auto: true }),
    });
    await onRefresh();
    setYardBusy(false);
  }

  async function saveSubtitle() {
    setSubtitleSaving(true);
    await fetch("/api/config", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-auth": password },
      body: JSON.stringify({ ...data.config, subtitle }),
    });
    await onRefresh();
    setSubtitleSaving(false);
    setSubtitleSaved(true);
    setTimeout(() => setSubtitleSaved(false), 2000);
  }

  async function toggleFinish() {
    setFinishing(true);
    const isFinishing = !data.finished.isFinished;
    const elapsedSnapshot = isFinishing ? lastYardElapsed(data.yards, data.config) : undefined;

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

      <button
        onClick={handleYardCompleted}
        disabled={yardBusy}
        className="w-full py-14 rounded bg-accent/10 border border-accent/30 text-accent text-2xl tracking-wide hover:bg-accent/20 transition-colors"
      >
        {yardBusy ? "Recording..." : "Yard Completed"}
      </button>

      <div className="my-8 border-t border-border" />

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

      <div className="flex flex-col gap-3">
        <h2>Display Message</h2>
        <input
          className="input"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          placeholder="Short line shown under the status heading"
        />
        <button onClick={saveSubtitle} disabled={subtitleSaving} className="btn-primary">
          {subtitleSaving ? "Saving..." : subtitleSaved ? "Saved!" : "Save Message"}
        </button>
      </div>

      <div className="my-8 border-t border-border" />

      <VideoManager
        youtubePlaylistId={data.youtubePlaylistId}
        password={password}
        onRefresh={onRefresh}
      />

      <div className="my-8 border-t border-border" />

      <YardManager
        yards={data.yards}
        config={data.config}
        password={password}
        onRefresh={onRefresh}
      />
    </div>
  );
}
