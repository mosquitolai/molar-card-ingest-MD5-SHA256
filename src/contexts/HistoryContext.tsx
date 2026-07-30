import React, { createContext, useContext, useEffect, useState } from "react";
import type { HistoryEntry } from "../types/disk";

interface HistoryContextValue {
  entries: HistoryEntry[];
  addEntry: (entry: HistoryEntry) => void;
  clear: () => void;
}

const HistoryContext = createContext<HistoryContextValue | null>(null);
const STORAGE_KEY = "molacard.history";

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<HistoryEntry[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const addEntry = (entry: HistoryEntry) => {
    setEntries((prev) => [entry, ...prev].slice(0, 200));
  };

  const clear = () => setEntries([]);

  return (
    <HistoryContext.Provider value={{ entries, addEntry, clear }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const ctx = useContext(HistoryContext);
  if (!ctx) throw new Error("useHistory must be used within HistoryProvider");
  return ctx;
}
