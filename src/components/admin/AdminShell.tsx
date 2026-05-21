"use client";

import { useState, useCallback } from "react";
import { AdminLogin } from "./AdminLogin";
import { AdminDashboard } from "./AdminDashboard";
import type { RaceData } from "@/lib/types";

interface AdminShellProps {
  initialData: RaceData;
}

export function AdminShell({ initialData }: AdminShellProps) {
  const [password, setPassword] = useState<string | null>(null);
  const [data, setData] = useState<RaceData>(initialData);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/race");
    if (res.ok) {
      const newData = await res.json();
      setData(newData);
    }
  }, []);

  if (!password) {
    return <AdminLogin onAuth={setPassword} />;
  }

  return (
    <AdminDashboard
      data={data}
      password={password}
      onRefresh={refresh}
    />
  );
}
