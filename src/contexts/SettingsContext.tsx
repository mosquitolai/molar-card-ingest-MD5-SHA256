import React, { createContext, useContext, useState } from "react";
import type { VerificationMode } from "../types/disk";

interface SettingsContextValue {
  defaultVerification: VerificationMode;
  setDefaultVerification: (v: VerificationMode) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);
const STORAGE_KEY = "molacard.defaultVerification";

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [defaultVerification, setDefaultVerificationState] =
    useState<VerificationMode>(() => {
      const saved = localStorage.getItem(STORAGE_KEY) as VerificationMode | null;
      return saved ?? "sha256";
    });

  const setDefaultVerification = (v: VerificationMode) => {
    setDefaultVerificationState(v);
    localStorage.setItem(STORAGE_KEY, v);
  };

  return (
    <SettingsContext.Provider value={{ defaultVerification, setDefaultVerification }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
