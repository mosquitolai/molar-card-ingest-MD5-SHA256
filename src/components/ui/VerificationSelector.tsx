import type { VerificationMode } from "../../types/disk";
import { useI18n } from "../../i18n";
import { Zap, Hash, ShieldCheck, ScanLine } from "lucide-react";

interface Props {
  value: VerificationMode;
  onChange: (v: VerificationMode) => void;
  disabled?: boolean;
}

export default function VerificationSelector({ value, onChange, disabled }: Props) {
  const { t } = useI18n();

  const options: { key: VerificationMode; label: string; desc: string; icon: React.ReactNode }[] = [
    { key: "none", label: t.clone.verificationFast, desc: t.clone.verificationFastDesc, icon: <Zap size={15} /> },
    { key: "md5", label: t.clone.verificationMd5, desc: t.clone.verificationMd5Desc, icon: <Hash size={15} /> },
    { key: "sha256", label: t.clone.verificationSha256, desc: t.clone.verificationSha256Desc, icon: <ShieldCheck size={15} /> },
    { key: "bitwise", label: t.clone.verificationBitwise, desc: t.clone.verificationBitwiseDesc, icon: <ScanLine size={15} /> },
  ];

  return (
    <div className="grid grid-cols-2 gap-2.5">
      {options.map((opt) => {
        const active = value === opt.key;
        return (
          <button
            key={opt.key}
            disabled={disabled}
            onClick={() => onChange(opt.key)}
            className="text-left p-3 rounded-[10px] transition-colors"
            style={{
              background: active ? "color-mix(in srgb, var(--accent) 12%, var(--bg-elev))" : "var(--bg-elev)",
              border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
              opacity: disabled ? 0.5 : 1,
              cursor: disabled ? "not-allowed" : "pointer",
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span style={{ color: active ? "var(--accent)" : "var(--text-secondary)" }}>{opt.icon}</span>
              <span className="text-[12.5px] font-medium">{opt.label}</span>
            </div>
            <p className="text-[11px] leading-snug" style={{ color: "var(--text-tertiary)" }}>
              {opt.desc}
            </p>
          </button>
        );
      })}
    </div>
  );
}
