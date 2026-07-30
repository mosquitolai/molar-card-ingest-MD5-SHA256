import { useState } from "react";
import Sidebar, { type ViewKey } from "./components/Sidebar";
import CloneView from "./components/views/CloneView";
import CardManagerView from "./components/views/CardManagerView";
import HistoryView from "./components/views/HistoryView";
import SettingsView from "./components/views/SettingsView";
import { ThemeProvider } from "./contexts/ThemeContext";
import { I18nProvider } from "./i18n";
import { DiskProvider } from "./contexts/DiskContext";
import { HistoryProvider } from "./contexts/HistoryContext";
import { SettingsProvider } from "./contexts/SettingsContext";

function Shell() {
  const [view, setView] = useState<ViewKey>("clone");

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: "var(--bg)" }}>
      <Sidebar active={view} onChange={setView} />
      <main className="flex-1 overflow-y-auto">
        {view === "clone" && <CloneView />}
        {view === "manager" && <CardManagerView />}
        {view === "history" && <HistoryView />}
        {view === "settings" && <SettingsView />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <SettingsProvider>
          <DiskProvider>
            <HistoryProvider>
              <Shell />
            </HistoryProvider>
          </DiskProvider>
        </SettingsProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
