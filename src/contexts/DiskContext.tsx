import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { DiskInfo } from "../types/disk";
import { mockDisks } from "../data/mockDisks";
import { safeInvoke } from "../lib/tauri";

interface DiskContextValue {
  disks: DiskInfo[];
  loading: boolean;
  refresh: () => Promise<void>;
}

const DiskContext = createContext<DiskContextValue | null>(null);

export function DiskProvider({ children }: { children: React.ReactNode }) {
  const [disks, setDisks] = useState<DiskInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    // In the native Tauri shell this calls into Rust (see src-tauri/src/main.rs
    // `list_disks`, backed by DiskArbitration / `diskutil list -plist`).
    // Outside Tauri (plain browser dev/preview) we fall back to mock data.
    const result = await safeInvoke<DiskInfo[]>("list_disks");
    setDisks(result ?? mockDisks);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <DiskContext.Provider value={{ disks, loading, refresh }}>
      {children}
    </DiskContext.Provider>
  );
}

export function useDisks() {
  const ctx = useContext(DiskContext);
  if (!ctx) throw new Error("useDisks must be used within DiskProvider");
  return ctx;
}
