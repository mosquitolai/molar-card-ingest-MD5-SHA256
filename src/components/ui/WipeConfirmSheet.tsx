import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import type { DiskInfo } from "../../types/disk";
import { formatBytes } from "../../data/mockDisks";
import { useI18n } from "../../i18n";

interface Props {
  disk: DiskInfo;
  formatAs: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function WipeConfirmSheet({ disk, formatAs, onCancel, onConfirm }: Props) {
  const { t } = useI18n();
  const [typed, setTyped] = useState("");
  const matches = typed.trim() === disk.label;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-6"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="card w-full max-w-[420px] p-5" style={{ borderColor: "var(--danger)" }}>
        <div className="flex items-start gap-3 mb-4">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "var(--danger-bg)" }}
          >
            <AlertTriangle size={18} color="var(--danger)" />
          </div>
          <div>
            <h3 className="text-[14px] font-semibold" style={{ color: "var(--danger)" }}>
              {t.manager.warningTitle}
            </h3>
            <p className="text-[12.5px] mt-1 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {t.manager.warningBody}
            </p>
          </div>
        </div>

        <div
          className="rounded-[10px] p-3 mb-4 text-[12.5px] space-y-1"
          style={{ background: "var(--bg-elev-2)" }}
        >
          <div className="flex justify-between">
            <span style={{ color: "var(--text-secondary)" }}>{t.common.selectDisk}</span>
            <span className="font-medium">{disk.label}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: "var(--text-secondary)" }}>{t.common.size}</span>
            <span>{formatBytes(disk.sizeBytes)}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: "var(--text-secondary)" }}>{t.manager.formatAs}</span>
            <span>{formatAs}</span>
          </div>
        </div>

        <label className="block text-[11.5px] mb-1.5" style={{ color: "var(--text-secondary)" }}>
          {t.manager.typeToConfirm}
        </label>
        <input
          className="input w-full rounded-[8px] px-3 py-2 text-[13px] mb-4"
          placeholder={`${t.manager.typePlaceholder} (${disk.label})`}
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          autoFocus
        />

        <div className="flex justify-end gap-2">
          <button className="btn-ghost rounded-[8px] px-4 py-2 text-[13px]" onClick={onCancel}>
            {t.common.cancel}
          </button>
          <button
            className="rounded-[8px] px-4 py-2 text-[13px] font-medium"
            style={{
              background: "var(--danger)",
              color: "#fff",
              opacity: matches ? 1 : 0.4,
              cursor: matches ? "pointer" : "not-allowed",
            }}
            disabled={!matches}
            onClick={onConfirm}
          >
            {t.manager.erase}
          </button>
        </div>
      </div>
    </div>
  );
}
