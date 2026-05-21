"use client";

import { useState, FormEvent } from "react";

interface AdminLoginProps {
  onAuth: (password: string) => void;
}

export function AdminLogin({ onAuth }: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (res.ok) {
      onAuth(password);
    } else {
      setError("Incorrect password.");
      setPassword("");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-xl font-mono mb-6 text-center">Admin Access</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="input"
            autoFocus
            required
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Verifying..." : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}
