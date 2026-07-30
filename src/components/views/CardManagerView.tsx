import { useState } from "react";
import { Eraser, Lock } from "lucide-react";
import { useDisks } from "../../contexts/DiskContext";
import { useHistory } from "../../contexts/HistoryContext";
import { useI18n } from "../../i18n";
import { formatBytes } from "../../data/mockDisks";
import { safeInvoke } from "../../lib/tauri";
import WipeConfirmSheet from "../ui/WipeConfirmSheet";
import type { DiskInfo } from "../../types/disk";

const FORMAT_OPTIONS = ["exFAT", "FAT32", "APFS"] as const;

export default function CardManagerView() {
  const { t } = useI18n();
  const { disks, refresh } = useDisks();
  const { addEntry } = useHistory();

  const [target, setTarget] = useState<DiskInfo | null>(null);
  const [formatAs, setFormatAs] = useState<(typeof FORMAT_OPTIONS)[number]>("exFAT");
  const [confirming, setConfirming] = useState(false);

  const handleErase = async () => {
    if (!target) return;
    const result = await safeInvoke<string>("wipe_disk", {
      args: {
        diskId: target.id,
        mountPath: target.mountPath,
        label: target.label,
        formatAs,
      },
    });
    addEntry({
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      sourceLabel: target.label,
      destLabel: `${t.manager.formatAs}: ${formatAs}`,
      sizeBytes: target.sizeBytes,
      verification: "none",
      status: "success",
      durationSeconds: 3,
      detail: result ?? t.manager.wipe,
    });
    setConfirming(false);
    setTarget(null);
    refresh();
  };

  return (
    <div className="max-w-[720px] mx-auto py-10 px-8">
      <header className="mb-6">
        <h1 className="text-[20px] font-semibold tracking-tight">{t.manager.title}</h1>
        <p className="text-[13px] mt-1" style={{ color: "var(--text-secondary)" }}>
          {t.manager.subtitle}
        </p>
      </header>

      <div className="space-y-2.5 mb-6">
        {disks.map((disk) => {
          const selected = target?.id === disk.id;
          return (
            <button
              key={disk.id}
              disabled={disk.isSystemDisk}
              onClick={() => setTarget(disk)}
              className="w-full flex items-center justify-between p-3.5 rounded-[10px] text-left"
              style={{
                background: selected ? "color-mix(in srgb, var(--danger) 8%, var(--bg-elev))" : "var(--bg-elev)",
                border: `1px solid ${selected ? "var(--danger)" : "var(--border)"}`,
                opacity: disk.isSystemDisk ? 0.5 : 1,
                cursor: disk.isSystemDisk ? "not-allowed" : "pointer",
              }}
            >
              <div>
                <div className="text-[13.5px] font-medium flex items-center gap-2">
                  {disk.label}
                  {disk.isSystemDisk && <Lock size={12} style={{ color: "var(--text-tertiary)" }} />}
                </div>
                <div className="text-[11.5px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                  {formatBytes(disk.usedBytes)} / {formatBytes(disk.sizeBytes)} · {disk.fileSystem} · {disk.mountPath}
                </div>
              </div>
              {disk.isSystemDisk && (
                <span className="text-[10.5px]" style={{ color: "var(--text-tertiary)" }}>
                  {t.manager.systemDiskBlocked}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {target && (
        <div className="card p-4 mb-6">
          <div className="text-[12px] font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--text-secondary)" }}>
            {t.manager.formatAs}
          </div>
          <div className="flex gap-2">
            {FORMAT_OPTIONS.map((fmt) => (
              <button
                key={fmt}
                onClick={() => setFormatAs(fmt)}
                className="px-3.5 py-1.5 rounded-full text-[12.5px]"
                style={{
                  background: formatAs === fmt ? "var(--accent)" : "var(--bg-elev-2)",
                  color: formatAs === fmt ? "var(--accent-text)" : "var(--text)",
                }}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        disabled={!target}
        onClick={() => setConfirming(true)}
        className="flex items-center gap-2 rounded-[10px] px-5 py-2.5 text-[13.5px] font-medium"
        style={{
          background: "var(--danger)",
          color: "#fff",
          opacity: target ? 1 : 0.35,
          cursor: target ? "pointer" : "not-allowed",
        }}
      >
        <Eraser size={14} />
        {t.manager.wipe}
      </button>

      {confirming && target && (
        <WipeConfirmSheet
          disk={target}
          formatAs={formatAs}
          onCancel={() => setConfirming(false)}
          onConfirm={handleErase}
        />
      )}
    </div>
  );
}
