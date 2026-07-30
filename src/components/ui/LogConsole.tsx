import { useEffect, useRef, useState } from "react";
import { ChevronRight, Terminal } from "lucide-react";
import { useI18n } from "../../i18n";

export default function LogConsole({ lines }: { lines: string[] }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div className="card overflow-hidden">
      <button
        className="w-full flex items-center gap-2 px-4 py-3 text-[12px] font-medium"
        onClick={() => setOpen((o) => !o)}
        style={{ color: "var(--text-secondary)" }}
      >
        <ChevronRight
          size={13}
          className="transition-transform"
          style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
        />
        <Terminal size={13} />
        {t.clone.log}
        <span className="ml-auto text-[11px]" style={{ color: "var(--text-tertiary)" }}>
          {lines.length}
        </span>
      </button>
      {open && (
        <div
          ref={scrollRef}
          className="px-4 pb-4 max-h-40 overflow-y-auto text-[11.5px] leading-relaxed"
          style={{ fontFamily: "ui-monospace, monospace", color: "var(--text-secondary)" }}
        >
          {lines.length === 0 ? (
            <div style={{ color: "var(--text-tertiary)" }}>--</div>
          ) : (
            lines.map((line, i) => <div key={i}>{line}</div>)
          )}
        </div>
      )}
    </div>
  );
}
