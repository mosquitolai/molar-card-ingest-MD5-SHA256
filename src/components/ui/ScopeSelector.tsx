import { useState } from "react";
import { FolderPlus, X, HardDrive, ListChecks } from "lucide-react";
import type { DiskInfo } from "../../types/disk";
import { useI18n } from "../../i18n";
import { relativeTo } from "../../lib/folderPicker";
import FolderTreeModal from "./FolderTreeModal";

export type ScopeMode = "full" | "folders";

interface Props {
  sourceDisk: DiskInfo;
  mode: ScopeMode;
  onModeChange: (m: ScopeMode) => void;
  folders: string[];
  onFoldersChange: (folders: string[]) => void;
  disabled?: boolean;
}

export default function ScopeSelector({
  sourceDisk,
  mode,
  onModeChange,
  folders,
  onFoldersChange,
  disabled,
}: Props) {
  const { t } = useI18n();
  const [browsing, setBrowsing] = useState(false);

  const removeFolder = (path: string) => {
    onFoldersChange(folders.filter((f) => f !== path));
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-2.5 mb-3">
        <button
          disabled={disabled}
          onClick={() => onModeChange("full")}
          className="text-left p-3 rounded-[10px] transition-colors"
          style={{
            background: mode === "full" ? "color-mix(in srgb, var(--accent) 12%, var(--bg-elev))" : "var(--bg-elev)",
            border: `1px solid ${mode === "full" ? "var(--accent)" : "var(--border)"}`,
            opacity: disabled ? 0.5 : 1,
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <HardDrive size={15} style={{ color: mode === "full" ? "var(--accent)" : "var(--text-secondary)" }} />
            <span className="text-[12.5px] font-medium">{t.clone.scopeFull}</span>
          </div>
          <p className="text-[11px] leading-snug" style={{ color: "var(--text-tertiary)" }}>
            {t.clone.scopeFullDesc}
          </p>
        </button>

        <button
          disabled={disabled}
          onClick={() => onModeChange("folders")}
          className="text-left p-3 rounded-[10px] transition-colors"
          style={{
            background: mode === "folders" ? "color-mix(in srgb, var(--accent) 12%, var(--bg-elev))" : "var(--bg-elev)",
            border: `1px solid ${mode === "folders" ? "var(--accent)" : "var(--border)"}`,
            opacity: disabled ? 0.5 : 1,
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <FolderPlus size={15} style={{ color: mode === "folders" ? "var(--accent)" : "var(--text-secondary)" }} />
            <span className="text-[12.5px] font-medium">{t.clone.scopeFolders}</span>
          </div>
          <p className="text-[11px] leading-snug" style={{ color: "var(--text-tertiary)" }}>
            {t.clone.scopeFoldersDesc}
          </p>
        </button>
      </div>

      {mode === "folders" && (
        <div className="rounded-[10px] p-3" style={{ background: "var(--bg-elev-2)" }}>
          {folders.length === 0 ? (
            <div className="text-[12px] mb-2.5" style={{ color: "var(--text-tertiary)" }}>
              {t.clone.noFoldersSelected}
            </div>
          ) : (
            <ul className="space-y-1.5 mb-2.5">
              {folders.map((f) => (
                <li
                  key={f}
                  className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-[7px] text-[12px]"
                  style={{ background: "var(--bg-elev)", border: "1px solid var(--border)" }}
                >
                  <span className="truncate" title={f} style={{ fontFamily: "ui-monospace, monospace" }}>
                    {relativeTo(f, sourceDisk.mountPath) || f}
                  </span>
                  {!disabled && (
                    <button onClick={() => removeFolder(f)} title={t.clone.removeFolder} className="shrink-0">
                      <X size={13} style={{ color: "var(--text-tertiary)" }} />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}

          {!disabled && (
            <button
              onClick={() => setBrowsing(true)}
              className="btn-ghost flex items-center gap-1.5 rounded-[7px] px-3 py-1.5 text-[12px]"
            >
              <ListChecks size={13} />
              {t.clone.addFolder}
            </button>
          )}
        </div>
      )}

      {browsing && (
        <FolderTreeModal
          disk={sourceDisk}
          initialSelected={folders}
          onCancel={() => setBrowsing(false)}
          onConfirm={(paths) => {
            onFoldersChange(paths);
            setBrowsing(false);
          }}
        />
      )}
    </div>
  );
}
