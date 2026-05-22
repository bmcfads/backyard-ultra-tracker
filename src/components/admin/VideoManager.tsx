"use client";

import { useState, FormEvent } from "react";

interface VideoManagerProps {
  youtubePlaylistId: string;
  password: string;
  onRefresh: () => Promise<void>;
}

export function VideoManager({ youtubePlaylistId, password, onRefresh }: VideoManagerProps) {
  const [playlistId, setPlaylistId] = useState(youtubePlaylistId);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    await fetch("/api/videos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-auth": password,
      },
      body: JSON.stringify({ youtubePlaylistId: playlistId.trim() }),
    });

    await onRefresh();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2>Videos</h2>

      <div className="flex flex-col gap-1">
        <label className="label">YouTube Playlist ID</label>
        <input
          className="input"
          value={playlistId}
          onChange={(e) => setPlaylistId(e.target.value)}
          placeholder="e.g. PLxxxxxxxxxxxxxxxxxxxxxx"
        />
        <p className="text-xs text-muted">
          Found in the playlist URL: youtube.com/playlist?list=<strong>PLAYLIST_ID</strong>
        </p>
      </div>

      <button type="submit" disabled={saving} className="btn-primary">
        {saving ? "Saving..." : saved ? "Saved!" : "Save Video Settings"}
      </button>
    </form>
  );
}
