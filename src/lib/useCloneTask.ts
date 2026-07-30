import { useCallback, useEffect, useRef, useState } from "react";
import type { CloneProgress, VerificationMode } from "../types/disk";
import { isTauri, safeInvoke, safeListen } from "./tauri";

const initialProgress: CloneProgress = {
  status: "idle",
  percent: 0,
  bytesDone: 0,
  bytesTotal: 0,
  speedBps: 0,
  etaSeconds: 0,
  currentStep: "",
};

export interface StartCloneOptions {
  /** Absolute paths to copy. In "full" mode this is a single-item array
   *  containing the source drive's mount path; in "folders" mode it's the
   *  list of folders the user picked. */
  sourcePaths: string[];
  /** Absolute destination directory the sources should be copied into. */
  destPath: string;
  mode: "full" | "folders";
  verification: VerificationMode;
  /** Used only for the browser-preview simulation (no real files to size). */
  simulatedTotalBytes: number;
  sourceLabel: string;
}

export function useCloneTask() {
  const [progress, setProgress] = useState<CloneProgress>(initialProgress);
  const [logs, setLogs] = useState<string[]>([]);
  const simTimer = useRef<number | null>(null);

  const appendLog = useCallback((line: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${time}] ${line}`]);
  }, []);

  useEffect(() => {
    let unlisten: (() => void) | undefined;
    safeListen<CloneProgress>("clone-progress", (payload) => {
      setProgress(payload);
      if (payload.currentStep) appendLog(payload.currentStep);
    }).then((fn) => (unlisten = fn));
    return () => unlisten?.();
  }, [appendLog]);

  const stopSimulation = () => {
    if (simTimer.current) {
      window.clearInterval(simTimer.current);
      simTimer.current = null;
    }
  };

  const runSimulation = useCallback(
    (opts: StartCloneOptions) => {
      const total = opts.simulatedTotalBytes;
      let done = 0;
      const speed = (60 + Math.random() * 40) * 1024 * 1024; // ~60-100 MB/s

      if (opts.mode === "folders") {
        appendLog(`拷貝範圍：${opts.sourcePaths.length} 個資料夾`);
      } else {
        appendLog(`拷貝範圍：整個裝置（${opts.sourceLabel}）`);
      }
      appendLog(`目標路徑：${opts.destPath}`);
      appendLog("準備拷貝作業…");

      setProgress({
        status: "preparing",
        percent: 0,
        bytesDone: 0,
        bytesTotal: total,
        speedBps: 0,
        etaSeconds: total / speed,
        currentStep: "preparing",
      });

      window.setTimeout(() => {
        appendLog("開始逐區塊拷貝");
        simTimer.current = window.setInterval(() => {
          done = Math.min(total, done + speed * 0.4);
          const percent = (done / total) * 100;
          const isDone = done >= total;

          setProgress({
            status: isDone
              ? opts.verification === "none"
                ? "success"
                : "verifying"
              : "copying",
            percent: Math.min(100, percent),
            bytesDone: done,
            bytesTotal: total,
            speedBps: speed,
            etaSeconds: Math.max(0, (total - done) / speed),
            currentStep: "",
          });

          if (isDone) {
            stopSimulation();
            if (opts.verification === "none") {
              appendLog("拷貝完成，未啟用校驗。");
              setProgress((p) => ({ ...p, status: "success", percent: 100 }));
            } else {
              const label =
                opts.verification === "md5"
                  ? "MD5"
                  : opts.verification === "sha256"
                  ? "SHA-256"
                  : "逐位元比對";
              appendLog(`拷貝完成，開始 ${label} 校驗…`);
              window.setTimeout(() => {
                appendLog(`${label} 校驗通過，來源與目標資料一致。`);
                setProgress((p) => ({ ...p, status: "success", percent: 100 }));
              }, 1800 + Math.random() * 1200);
            }
          }
        }, 350);
      }, 700);
    },
    [appendLog]
  );

  const start = useCallback(
    async (opts: StartCloneOptions) => {
      setLogs([]);
      if (isTauri()) {
        appendLog("已送出拷貝作業至背景引擎…");
        await safeInvoke("start_clone", {
          args: {
            sourcePaths: opts.sourcePaths,
            destPath: opts.destPath,
            mode: opts.mode,
            verification: opts.verification,
          },
        });
      } else {
        runSimulation(opts);
      }
    },
    [appendLog, runSimulation]
  );

  const cancel = useCallback(async () => {
    if (isTauri()) {
      await safeInvoke("cancel_clone");
    } else {
      stopSimulation();
    }
    appendLog("使用者取消作業。");
    setProgress((p) => ({ ...p, status: "cancelled" }));
  }, [appendLog]);

  const reset = useCallback(() => {
    stopSimulation();
    setProgress(initialProgress);
    setLogs([]);
  }, []);

  return { progress, logs, start, cancel, reset };
}
