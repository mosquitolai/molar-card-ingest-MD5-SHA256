import { Copy, Eraser, History, Settings, HardDrive } from "lucide-react";
import { useI18n } from "../i18n";

export type ViewKey = "clone" | "manager" | "history" | "settings";

interface SidebarProps {
  active: ViewKey;
  onChange: (v: ViewKey) => void;
}

export default function Sidebar({ active, onChange }: SidebarProps) {
  const { t } = useI18n();

  const items: { key: ViewKey; label: string; icon: React.ReactNode }[] = [
    { key: "clone", label: t.nav.clone, icon: <Copy size={16} strokeWidth={2} /> },
    { key: "manager", label: t.nav.manager, icon: <Eraser size={16} strokeWidth={2} /> },
    { key: "history", label: t.nav.history, icon: <History size={16} strokeWidth={2} /> },
    { key: "settings", label: t.nav.settings, icon: <Settings size={16} strokeWidth={2} /> },
  ];

  return (
    <aside
      className="w-[220px] shrink-0 h-full flex flex-col pt-10 px-3"
      style={{ background: "var(--bg)", borderRight: "1px solid var(--border)" }}
    >
      <div className="flex items-center gap-2 px-3 mb-8">
        <div
          className="w-7 h-7 rounded-[8px] flex items-center justify-center"
          style={{ background: "var(--accent)" }}
        >
          <HardDrive size={15} color="var(--accent-text)" strokeWidth={2.4} />
        </div>
        <span className="text-[14px] font-semibold tracking-tight">MolaCard</span>
      </div>

      <nav className="flex flex-col gap-1">
        {items.map((item) => {
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onChange(item.key)}
              className="flex items-center gap-2.5 px-3 py-[7px] rounded-[8px] text-[13px] transition-colors text-left"
              style={{
                background: isActive ? "var(--bg-elev-2)" : "transparent",
                color: isActive ? "var(--text)" : "var(--text-secondary)",
                fontWeight: isActive ? 600 : 500,
              }}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto mb-6 px-3 text-[11px]" style={{ color: "var(--text-tertiary)" }}>
        MolaCard v1.0.0
      </div>
    </aside>
  );
}
