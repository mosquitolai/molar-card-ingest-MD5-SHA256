import { CheckCircle2, XCircle, OctagonX, Trash2 } from "lucide-react";
import { useHistory } from "../../contexts/HistoryContext";
import { useI18n } from "../../i18n";
import { formatBytes } from "../../data/mockDisks";

const verificationLabelKey = {
  none: "verificationFast",
  md5: "verificationMd5",
  sha256: "verificationSha256",
  bitwise: "verificationBitwise",
} as const;

export default function HistoryView() {
  const { t } = useI18n();
  const { entries, clear } = useHistory();

  return (
    <div className="max-w-[820px] mx-auto py-10 px-8">
      <header className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-[20px] font-semibold tracking-tight">{t.history.title}</h1>
          <p className="text-[13px] mt-1" style={{ color: "var(--text-secondary)" }}>
            {t.history.subtitle}
          </p>
        </div>
        {entries.length > 0 && (
          <button onClick={clear} className="btn-ghost flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-[12px]">
            <Trash2 size={13} />
            {t.history.clear}
          </button>
        )}
      </header>

      {entries.length === 0 ? (
        <div
          className="text-[13px] py-16 text-center rounded-[12px]"
          style={{ color: "var(--text-tertiary)", background: "var(--bg-elev-2)" }}
        >
          {t.history.empty}
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((e) => (
            <div key={e.id} className="card p-3.5 flex items-center gap-3">
              <StatusIcon status={e.status} />
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium truncate">
                  {e.sourceLabel} → {e.destLabel}
                </div>
                <div className="text-[11.5px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                  {new Date(e.timestamp).toLocaleString()} · {formatBytes(e.sizeBytes)} ·{" "}
                  {t.clone[verificationLabelKey[e.verification]]}
                </div>
                {e.detail && (
                  <div
                    className="text-[11px] mt-0.5 truncate"
                    style={{ color: "var(--text-tertiary)", fontFamily: "ui-monospace, monospace" }}
                  >
                    {e.detail}
                  </div>
                )}
              </div>
              <div className="text-[11.5px] text-right shrink-0" style={{ color: "var(--text-secondary)" }}>
                <div>
                  {t.history.duration}: {e.durationSeconds}s
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusIcon({ status }: { status: "success" | "failed" | "cancelled" }) {
  if (status === "success") return <CheckCircle2 size={18} color="var(--success)" />;
  if (status === "failed") return <XCircle size={18} color="var(--danger)" />;
  return <OctagonX size={18} color="var(--text-tertiary)" />;
}
