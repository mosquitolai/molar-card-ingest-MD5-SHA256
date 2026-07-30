export type FileSystemType = "exFAT" | "FAT32" | "APFS" | "HFS+" | "NTFS";

export interface DiskInfo {
  id: string;
  label: string;
  mountPath: string;
  sizeBytes: number;
  usedBytes: number;
  fileSystem: FileSystemType;
  speedClass: string; // e.g. "UHS-II U3 / V90"
  isRemovable: boolean;
  isSystemDisk: boolean;
  kind: "SD" | "MicroSD" | "CFexpress" | "USB" | "HDD" | "SSD" | "Unknown";
}

export type VerificationMode = "none" | "md5" | "sha256" | "bitwise";

export type TaskStatus =
  | "idle"
  | "preparing"
  | "copying"
  | "verifying"
  | "success"
  | "failed"
  | "cancelled";

export interface CloneProgress {
  status: TaskStatus;
  percent: number; // 0-100
  bytesDone: number;
  bytesTotal: number;
  speedBps: number;
  etaSeconds: number;
  currentStep: string;
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  sourceLabel: string;
  destLabel: string;
  sizeBytes: number;
  verification: VerificationMode;
  status: "success" | "failed" | "cancelled";
  durationSeconds: number;
  detail?: string;
}

export type ThemeMode = "dark" | "light" | "milktea";

export type LanguageCode =
  | "zh-TW"
  | "zh-CN"
  | "en"
  | "ja"
  | "de"
  | "fr"
  | "nl"
  | "ru";

/** A single row in the in-app folder/file tree browser ("select range"). */
export interface TreeEntry {
  name: string;
  path: string;
  isDir: boolean;
  sizeBytes: number;
}
