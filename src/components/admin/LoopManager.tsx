"use client";

import { useState } from "react";
import type { Loop, RaceConfig } from "@/lib/types";
import { formatLoopTime } from "@/lib/race";

interface LoopManagerProps {
  loops: Loop[];
  config: RaceConfig;
  password: string;
  onRefresh: () => Promise<void>;
}

export function LoopManager({ loops, config, password, onRefresh }: LoopManagerProps) {
  const timezone = config.timezone || "UTC";
  const [adding, setAdding] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  async function handleAddManual() {
    if (!newDate || !newTime) return;
    setBusy("manual");
    await fetch("/api/loops", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-auth": password,
      },
      body: JSON.stringify({ date: newDate, time: newTime }),
    });
    await onRefresh();
    setNewDate("");
    setNewTime("");
    setAdding(false);
    setBusy(null);
  }

  async function handleUpdate(loop: Loop, field: "date" | "time", value: string) {
    setBusy(loop.id);
    await fetch(`/api/loops/${loop.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-auth": password,
      },
      body: JSON.stringify({ [field]: value }),
    });
    await onRefresh();
    setBusy(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this loop?")) return;
    setBusy(id + "-del");
    await fetch(`/api/loops/${id}`, {
      method: "DELETE",
      headers: { "x-admin-auth": password },
    });
    await onRefresh();
    setBusy(null);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline gap-3">
        <h2>Loops</h2>
        <span className="text-xs text-muted">{timezone}</span>
      </div>

      {loops.length > 0 && (
        <div className="flex flex-col gap-2 mt-2">
          {loops.map((loop) => (
            <div
              key={loop.id}
              className="border border-border rounded p-3 flex flex-col gap-2 text-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-muted">#{loop.loopCount}</span>
                <button
                  onClick={() => handleDelete(loop.id)}
                  disabled={busy === loop.id + "-del"}
                  className="text-xs text-muted hover:text-red-400 transition-colors"
                >
                  Delete
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="label">Date</label>
                  <input
                    type="date"
                    className="input text-sm py-1"
                    defaultValue={loop.date}
                    onBlur={(e) => {
                      if (e.target.value !== loop.date) {
                        handleUpdate(loop, "date", e.target.value);
                      }
                    }}
                    disabled={busy === loop.id}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="label">Time</label>
                  <input
                    type="time"
                    step="1"
                    className="input text-sm py-1"
                    defaultValue={loop.time}
                    onBlur={(e) => {
                      if (e.target.value !== loop.time) {
                        handleUpdate(loop, "time", e.target.value);
                      }
                    }}
                    disabled={busy === loop.id}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                <span>{formatLoopTime(loop, timezone)}</span>
                <span>Duration: {loop.duration}</span>
                <span>Pace: {loop.pace}/km</span>
                <span>{loop.cumulativeKm.toFixed(2)} km</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {adding ? (
        <div className="border border-border rounded p-3 flex flex-col gap-3">
          <p className="text-sm text-muted">Add loop manually</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="label">Date</label>
              <input
                type="date"
                className="input text-sm py-1"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="label">Time</label>
              <input
                type="time"
                step="1"
                className="input text-sm py-1"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddManual}
              disabled={busy === "manual" || !newDate || !newTime}
              className="btn-primary flex-1 text-sm py-2"
            >
              {busy === "manual" ? "Saving..." : "Add Loop"}
            </button>
            <button
              onClick={() => setAdding(false)}
              className="flex-1 text-sm py-2 border border-border rounded text-muted hover:text-text transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="text-sm text-muted hover:text-text transition-colors text-left py-1"
        >
          + Add loop manually
        </button>
      )}
    </div>
  );
}
