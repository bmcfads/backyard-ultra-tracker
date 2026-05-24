"use client";

import { useState, useEffect } from "react";
import type { Loop, RaceConfig } from "@/lib/types";

interface LoopManagerProps {
  loops: Loop[];
  config: RaceConfig;
  password: string;
  onRefresh: () => Promise<void>;
}

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, isNaN(val) ? min : val));
}

function LoopTimeEditor({
  storedTime,
  disabled,
  onUpdate,
}: {
  storedTime: string;
  disabled: boolean;
  onUpdate: (time: string) => void;
}) {
  const parse = (t: string) => {
    const [h = "0", m = "0", s = "0"] = t.split(":");
    return { h: parseInt(h, 10), m: parseInt(m, 10), s: parseInt(s, 10) };
  };
  const init = parse(storedTime);
  const [h, setH] = useState(init.h);
  const [m, setM] = useState(init.m);
  const [s, setS] = useState(init.s);

  useEffect(() => {
    const p = parse(storedTime);
    setH(p.h); setM(p.m); setS(p.s);
  }, [storedTime]);

  function commit() {
    const full = [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
    if (full !== storedTime) onUpdate(full);
  }

  return (
    <div className="flex gap-1 items-center">
      <input type="number" min={0} max={23}
        className="input text-sm py-1 w-14 text-center" value={h}
        onChange={(e) => setH(clamp(parseInt(e.target.value, 10), 0, 23))}
        onBlur={commit} disabled={disabled} />
      <span className="text-xs text-muted">:</span>
      <input type="number" min={0} max={59}
        className="input text-sm py-1 w-14 text-center" value={m}
        onChange={(e) => setM(clamp(parseInt(e.target.value, 10), 0, 59))}
        onBlur={commit} disabled={disabled} />
      <span className="text-xs text-muted">:</span>
      <input type="number" min={0} max={59}
        className="input text-sm py-1 w-14 text-center" value={s}
        onChange={(e) => setS(clamp(parseInt(e.target.value, 10), 0, 59))}
        onBlur={commit} disabled={disabled} />
    </div>
  );
}

export function LoopManager({ loops, config, password, onRefresh }: LoopManagerProps) {
  const timezone = config.timezone || "UTC";
  const [adding, setAdding] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newH, setNewH] = useState(0);
  const [newM, setNewM] = useState(0);
  const [newS, setNewS] = useState(0);
  const [busy, setBusy] = useState<string | null>(null);

  async function handleAddManual() {
    if (!newDate) return;
    setBusy("manual");
    const fullTime = [newH, newM, newS].map((n) => String(n).padStart(2, "0")).join(":");
    await fetch("/api/loops", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-auth": password,
      },
      body: JSON.stringify({ date: newDate, time: fullTime }),
    });
    await onRefresh();
    setNewDate("");
    setNewH(0); setNewM(0); setNewS(0);
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
                  <LoopTimeEditor
                    storedTime={loop.time}
                    disabled={busy === loop.id}
                    onUpdate={(t) => handleUpdate(loop, "time", t)}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted mt-1">
                <span>Duration: <span className="text-text">{loop.duration}</span></span>
                <span>Pace: <span className="text-text">{loop.pace}/km</span></span>
                <span>Dist: <span className="text-text">{loop.cumulativeKm.toFixed(2)} km</span></span>
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
              <div className="flex gap-1 items-center">
                <input type="number" min={0} max={23}
                  className="input text-sm py-1 w-14 text-center" value={newH}
                  onChange={(e) => setNewH(clamp(parseInt(e.target.value, 10), 0, 23))} />
                <span className="text-xs text-muted">:</span>
                <input type="number" min={0} max={59}
                  className="input text-sm py-1 w-14 text-center" value={newM}
                  onChange={(e) => setNewM(clamp(parseInt(e.target.value, 10), 0, 59))} />
                <span className="text-xs text-muted">:</span>
                <input type="number" min={0} max={59}
                  className="input text-sm py-1 w-14 text-center" value={newS}
                  onChange={(e) => setNewS(clamp(parseInt(e.target.value, 10), 0, 59))} />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddManual}
              disabled={busy === "manual" || !newDate}
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
