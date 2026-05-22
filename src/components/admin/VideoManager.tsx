"use client";

import { useState, FormEvent } from "react";
import type { VideoMode } from "@/lib/types";

interface VideoManagerProps {
  videoMode: VideoMode;
  tiktokUsername: string;
  videos: string[];
  password: string;
  onRefresh: () => Promise<void>;
}

export function VideoManager({
  videoMode,
  tiktokUsername,
  videos,
  password,
  onRefresh,
}: VideoManagerProps) {
  const [mode, setMode] = useState<VideoMode>(videoMode);
  const [username, setUsername] = useState(tiktokUsername);
  const [urls, setUrls] = useState<string[]>(videos.length > 0 ? videos : [""]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    const cleanUrls = urls.filter((u) => u.trim() !== "");

    await fetch("/api/videos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-auth": password,
      },
      body: JSON.stringify({
        videoMode: mode,
        tiktokUsername: username,
        videos: cleanUrls,
      }),
    });

    await onRefresh();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function addUrl() {
    setUrls([...urls, ""]);
  }

  function updateUrl(i: number, value: string) {
    const next = [...urls];
    next[i] = value;
    setUrls(next);
  }

  function removeUrl(i: number) {
    setUrls(urls.filter((_, idx) => idx !== i));
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2>Videos</h2>

      <div className="flex flex-col gap-1">
        <label className="label">Video Mode</label>
        <select
          className="input"
          value={mode}
          onChange={(e) => setMode(e.target.value as VideoMode)}
        >
          <option value="profile">Profile Feed</option>
          <option value="urls">Video URLs</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="label">TikTok Username</label>
        <input
          className="input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="e.g. bmcfads"
        />
      </div>

      {mode === "urls" && (
        <div className="flex flex-col gap-2">
          <label className="label">Video URLs</label>
          {urls.map((url, i) => (
            <div key={i} className="flex gap-2">
              <input
                className="input flex-1"
                value={url}
                onChange={(e) => updateUrl(i, e.target.value)}
                placeholder="https://www.tiktok.com/@user/video/..."
              />
              {urls.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeUrl(i)}
                  className="text-muted hover:text-red-400 transition-colors text-sm px-2"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addUrl}
            className="text-sm text-muted hover:text-text transition-colors text-left py-1"
          >
            + Add URL
          </button>
        </div>
      )}

      <button type="submit" disabled={saving} className="btn-primary">
        {saving ? "Saving..." : saved ? "Saved!" : "Save Video Settings"}
      </button>
    </form>
  );
}
