import { RefreshCw, ChevronDown, HardDrive, AlertTriangle } from "lucide-react";
import type { DiskInfo } from "../../types/disk";
import { formatBytes } from "../../data/mockDisks";
import { useI18n } from "../../i18n";

interface DiskSelectorProps {
  title: string;
  disks: DiskInfo[];
  selected: DiskInfo | null;
  onSelect: (disk: DiskInfo | null) => void;
  onRefresh: () => void;
  loading?: boolean;
  excludeId?: string;
}

export default function DiskSelector({
  title,
  disks,
  selected,
  onSelect,
  onRefresh,
  loading,
  excludeId,
}: DiskSelectorProps) {
  const { t } = useI18n();
  const options = disks.filter((d) => d.id !== excludeId);

  return (
    <div className="card p-4 flex-1 min-w-0">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[12px] font-semibold uppercase tracking-wide" style={{ color: "var(--text-secondary)" }}>
          {title}
        </span>
        <button
          onClick={onRefresh}
          className="p-1.5 rounded-[6px] btn-ghost"
          title={t.common.refresh}
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="relative mb-3">
        <select
          className="input w-full appearance-none rounded-[8px] px-3 py-2 pr-8 text-[13px] cursor-pointer"
          value={selected?.id ?? ""}
          onChange={(e) => {
            const disk = options.find((d) => d.id === e.target.value) ?? null;
            onSelect(disk);
          }}
        >
          <option value="" disabled>
            {options.length === 0 ? t.common.noDisk : t.common.selectDisk}
          </option>
          {options.map((d) => (
            <option key={d.id} value={d.id}>
              {d.label} — {formatBytes(d.sizeBytes)}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: "var(--text-tertiary)" }}
        />
      </div>

      {selected ? (
        <div className="space-y-1.5 text-[12px]" style={{ color: "var(--text-secondary)" }}>
          <div className="flex items-center gap-2 mb-2">
            <HardDrive size={13} />
            <span className="text-[13px] font-medium" style={{ color: "var(--text)" }}>
              {selected.label}
            </span>
            {selected.isSystemDisk && (
              <span
                className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full"
                style={{ background: "var(--danger-bg)", color: "var(--danger)" }}
              >
                <AlertTriangle size={10} /> System
              </span>
            )}
          </div>
          <Row label={t.common.size} value={formatBytes(selected.sizeBytes)} />
          <Row label={t.common.used} value={formatBytes(selected.usedBytes)} />
          <Row label={t.common.fileSystem} value={selected.fileSystem} />
          <Row label={t.common.speedClass} value={selected.speedClass} />
          <Row label={t.common.mountPath} value={selected.mountPath} mono />
        </div>
      ) : (
        <div
          className="text-[12px] py-4 text-center rounded-[8px]"
          style={{ color: "var(--text-tertiary)", background: "var(--bg-elev-2)" }}
        >
          {t.common.noDisk}
        </div>
      )}
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span>{label}</span>
      <span
        className="truncate max-w-[60%] text-right"
        style={{ color: "var(--text)", fontFamily: mono ? "ui-monospace, monospace" : undefined }}
      >
        {value}
      </span>
    </div>
  );
}
