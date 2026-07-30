import { useEffect, useRef, useState } from "react";
import { ArrowRight, Copy, Square } from "lucide-react";
import { useDisks } from "../../contexts/DiskContext";
import { useHistory } from "../../contexts/HistoryContext";
import { useSettings } from "../../contexts/SettingsContext";
import { useI18n } from "../../i18n";
import DiskSelector from "../ui/DiskSelector";
import VerificationSelector from "../ui/VerificationSelector";
import ScopeSelector, { type ScopeMode } from "../ui/ScopeSelector";
import DestFolderInput from "../ui/DestFolderInput";
import ProgressPanel from "../ui/ProgressPanel";
import LogConsole from "../ui/LogConsole";
import { useCloneTask } from "../../lib/useCloneTask";
import { joinPath } from "../../lib/folderPicker";
import type { DiskInfo, VerificationMode } from "../../types/disk";

export default function CloneView() {
  const { t } = useI18n();
  const { disks, loading, refresh } = useDisks();
  const { addEntry } = useHistory();
  const { defaultVerification } = useSettings();

  const [source, setSource] = useState<DiskInfo | null>(null);
  const [dest, setDest] = useState<DiskInfo | null>(null);
  const [verification, setVerification] = useState<VerificationMode>(defaultVerification);
  const [scopeMode, setScopeMode] = useState<ScopeMode>("full");
  const [sourceFolders, setSourceFolders] = useState<string[]>([]);
  const [destSubfolder, setDestSubfolder] = useState("");

  const { progress, logs, start, cancel, reset } = useCloneTask();

  const isRunning = ["preparing", "copying", "verifying"].includes(progress.status);
  const scopeReady = scopeMode === "full" || sourceFolders.length > 0;
  const canStart = !!source && !!dest && source.id !== dest.id && scopeReady && !isRunning;

  // Reset folder selection whenever the source drive changes.
  useEffect(() => {
    setSourceFolders([]);
    setScopeMode("full");
  }, [source?.id]);

  const activeTask = useRef<{
    source: DiskInfo;
    dest: DiskInfo;
    verification: VerificationMode;
    scopeMode: ScopeMode;
    folderCount: number;
    destPath: string;
    startedAt: number;
  } | null>(null);

  const handleStart = async () => {
    if (!source || !dest) return;
    reset();

    const sourcePaths = scopeMode === "full" ? [source.mountPath] : sourceFolders;
    const destPath = destSubfolder ? joinPath(dest.mountPath, destSubfolder) : dest.mountPath;

    activeTask.current = {
      source,
      dest,
      verification,
      scopeMode,
      folderCount: sourcePaths.length,
      destPath,
      startedAt: Date.now(),
    };

    await start({
      sourcePaths,
      destPath,
      mode: scopeMode,
      verification,
      simulatedTotalBytes: source.usedBytes || source.sizeBytes * 0.6,
      sourceLabel: source.label,
    });
  };

  // Record the task to history exactly once when it reaches a terminal state.
  useEffect(() => {
    const terminal = ["success", "failed", "cancelled"];
    if (activeTask.current && terminal.includes(progress.status)) {
      const task = activeTask.current;
      activeTask.current = null;
      const scopeDetail =
        task.scopeMode === "full" ? undefined : `${task.folderCount} 個資料夾 → ${task.destPath}`;
      addEntry({
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        sourceLabel: task.source.label,
        destLabel: task.dest.label,
        sizeBytes: task.source.usedBytes,
        verification: task.verification,
        status: progress.status as "success" | "failed" | "cancelled",
        durationSeconds: Math.round((Date.now() - task.startedAt) / 1000),
        detail: scopeDetail,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress.status]);

  return (
    <div className="max-w-[880px] mx-auto py-10 px-8">
      <header className="mb-6">
        <h1 className="text-[20px] font-semibold tracking-tight">{t.clone.title}</h1>
        <p className="text-[13px] mt-1" style={{ color: "var(--text-secondary)" }}>
          {t.clone.subtitle}
        </p>
      </header>

      <div className="flex items-stretch gap-3 mb-6">
        <DiskSelector
          title={t.common.source}
          disks={disks}
          selected={source}
          onSelect={setSource}
          onRefresh={refresh}
          loading={loading}
          excludeId={dest?.id}
        />
        <div className="flex items-center justify-center px-1" style={{ color: "var(--text-tertiary)" }}>
          <ArrowRight size={18} />
        </div>
        <DiskSelector
          title={t.common.destination}
          disks={disks}
          selected={dest}
          onSelect={setDest}
          onRefresh={refresh}
          loading={loading}
          excludeId={source?.id}
        />
      </div>

      {source && (
        <div className="card p-4 mb-6">
          <div className="text-[12px] font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--text-secondary)" }}>
            {t.clone.scope}
          </div>
          <ScopeSelector
            sourceDisk={source}
            mode={scopeMode}
            onModeChange={setScopeMode}
            folders={sourceFolders}
            onFoldersChange={setSourceFolders}
            disabled={isRunning}
          />
        </div>
      )}

      {dest && (
        <div className="mb-6">
          <DestFolderInput
            destDisk={dest}
            subfolder={destSubfolder}
            onSubfolderChange={setDestSubfolder}
            disabled={isRunning}
          />
        </div>
      )}

      <div className="card p-4 mb-6">
        <div className="text-[12px] font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--text-secondary)" }}>
          {t.clone.verification}
        </div>
        <VerificationSelector value={verification} onChange={setVerification} disabled={isRunning} />
      </div>

      {progress.status !== "idle" && (
        <div className="mb-6 space-y-3">
          <ProgressPanel progress={progress} />
          <LogConsole lines={logs} />
        </div>
      )}

      <div className="flex items-center gap-3">
        {isRunning ? (
          <button
            onClick={cancel}
            className="flex items-center gap-2 rounded-[10px] px-5 py-2.5 text-[13.5px] font-medium btn-ghost"
          >
            <Square size={14} />
            {t.clone.cancelTask}
          </button>
        ) : (
          <button
            onClick={handleStart}
            disabled={!canStart}
            className="btn-primary flex items-center gap-2 rounded-[10px] px-5 py-2.5 text-[13.5px] font-medium"
          >
            <Copy size={14} />
            {t.clone.start}
          </button>
        )}
        {!canStart && !isRunning && (
          <span className="text-[12px]" style={{ color: "var(--text-tertiary)" }}>
            {!source || !dest ? t.clone.needBothDisks : !scopeReady ? t.clone.needFolders : ""}
          </span>
        )}
      </div>
    </div>
  );
}
