"use client";

import { useState, FormEvent } from "react";
import type { RaceConfig } from "@/lib/types";

interface RaceConfigFormProps {
  config: RaceConfig;
  password: string;
  onRefresh: () => Promise<void>;
}

export function RaceConfigForm({ config, password, onRefresh }: RaceConfigFormProps) {
  const [form, setForm] = useState<RaceConfig>(config);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    await fetch("/api/config", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-auth": password,
      },
      body: JSON.stringify(form),
    });

    await onRefresh();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2>Race Info</h2>

      <div className="flex flex-col gap-1">
        <label className="label">Race Title</label>
        <input
          className="input"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="e.g. Spring Backyard Ultra 2026"
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="label">Location</label>
        <input
          className="input"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          placeholder="e.g. Vancouver, BC"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="label">Start Date</label>
          <input
            type="date"
            className="input"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="label">Start Time</label>
          <input
            type="time"
            className="input"
            value={form.startTime}
            onChange={(e) => setForm({ ...form, startTime: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="label">Summary</label>
        <textarea
          className="input min-h-[80px] resize-y"
          value={form.summary}
          onChange={(e) => setForm({ ...form, summary: e.target.value })}
          placeholder="Brief description shown on the display page."
        />
      </div>

      <button type="submit" disabled={saving} className="btn-primary">
        {saving ? "Saving..." : saved ? "Saved!" : "Save Race Info"}
      </button>
    </form>
  );
}
