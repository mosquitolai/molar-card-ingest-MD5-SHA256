import type { CloneProgress } from "../../types/disk";
import { formatBytes, formatEta, formatSpeed } from "../../data/mockDisks";
import { useI18n } from "../../i18n";
import { CheckCircle2, XCircle, Loader2, OctagonX } from "lucide-react";

export default function ProgressPanel({ progress }: { progress: CloneProgress }) {
  const { t } = useI18n();

  const statusLabel: Record<CloneProgress["status"], string> = {
    idle: t.clone.statusIdle,
    preparing: t.clone.statusPreparing,
    copying: t.clone.statusCopying,
    verifying: t.clone.statusVerifying,
    success: t.clone.statusSuccess,
    failed: t.clone.statusFailed,
    cancelled: t.clone.statusCancelled,
  };

  const barColor =
    progress.status === "failed"
      ? "var(--danger)"
      : progress.status === "success"
      ? "var(--success)"
      : "var(--accent)";

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-[13px] font-medium">
          <StatusIcon status={progress.status} />
          {statusLabel[progress.status]}
        </div>
        <span className="text-[12px] tabular-nums" style={{ color: "var(--text-secondary)" }}>
          {progress.percent.toFixed(1)}%
        </span>
      </div>

      <div className="h-2 rounded-full overflow-hidden mb-3" style={{ background: "var(--bg-elev-2)" }}>
        <div
          className="h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${Math.min(100, progress.percent)}%`, background: barColor }}
        />
      </div>

      <div className="grid grid-cols-3 gap-3 text-[12px]">
        <Stat label={t.clone.progress} value={`${formatBytes(progress.bytesDone)} / ${formatBytes(progress.bytesTotal)}`} />
        <Stat label={t.clone.speed} value={progress.speedBps ? formatSpeed(progress.speedBps) : "--"} />
        <Stat label={t.clone.eta} value={formatEta(progress.etaSeconds)} />
      </div>
    </div>
  );
}

function StatusIcon({ status }: { status: CloneProgress["status"] }) {
  switch (status) {
    case "success":
      return <CheckCircle2 size={15} color="var(--success)" />;
    case "failed":
      return <XCircle size={15} color="var(--danger)" />;
    case "cancelled":
      return <OctagonX size={15} color="var(--text-tertiary)" />;
    case "copying":
    case "preparing":
    case "verifying":
      return <Loader2 size={15} className="animate-spin" style={{ color: "var(--accent)" }} />;
    default:
      return <span className="w-[15px] h-[15px] rounded-full" style={{ background: "var(--border)" }} />;
  }
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-2.5 rounded-[8px]" style={{ background: "var(--bg-elev-2)" }}>
      <div className="text-[10px] mb-0.5" style={{ color: "var(--text-tertiary)" }}>
        {label}
      </div>
      <div className="font-medium tabular-nums">{value}</div>
    </div>
  );
}
