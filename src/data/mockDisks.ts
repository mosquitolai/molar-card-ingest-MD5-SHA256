import type { DiskInfo } from "../types/disk";

const GB = 1024 ** 3;

export const mockDisks: DiskInfo[] = [
  {
    id: "disk4s1",
    label: "SONY_SD_A",
    mountPath: "/Volumes/SONY_SD_A",
    sizeBytes: 128 * GB,
    usedBytes: 84.6 * GB,
    fileSystem: "exFAT",
    speedClass: "UHS-II U3 / V90",
    isRemovable: true,
    isSystemDisk: false,
    kind: "SD",
  },
  {
    id: "disk5s1",
    label: "GOPRO_MICRO",
    mountPath: "/Volumes/GOPRO_MICRO",
    sizeBytes: 64 * GB,
    usedBytes: 12.1 * GB,
    fileSystem: "exFAT",
    speedClass: "UHS-I U3 / V30",
    isRemovable: true,
    isSystemDisk: false,
    kind: "MicroSD",
  },
  {
    id: "disk6s1",
    label: "RED_CFEXPRESS",
    mountPath: "/Volumes/RED_CFEXPRESS",
    sizeBytes: 512 * GB,
    usedBytes: 401.8 * GB,
    fileSystem: "APFS",
    speedClass: "CFexpress Type B",
    isRemovable: true,
    isSystemDisk: false,
    kind: "CFexpress",
  },
  {
    id: "disk7s1",
    label: "BACKUP_SSD",
    mountPath: "/Volumes/BACKUP_SSD",
    sizeBytes: 2000 * GB,
    usedBytes: 640 * GB,
    fileSystem: "APFS",
    speedClass: "USB 3.2 Gen 2",
    isRemovable: true,
    isSystemDisk: false,
    kind: "USB",
  },
  {
    id: "disk8s1",
    label: "USB_FLASH_32G",
    mountPath: "/Volumes/USB_FLASH_32G",
    sizeBytes: 32 * GB,
    usedBytes: 9.4 * GB,
    fileSystem: "FAT32",
    speedClass: "USB 2.0",
    isRemovable: true,
    isSystemDisk: false,
    kind: "USB",
  },
  {
    id: "disk9s1",
    label: "External HDD",
    mountPath: "/Volumes/External HDD",
    sizeBytes: 4000 * GB,
    usedBytes: 2150 * GB,
    fileSystem: "exFAT",
    speedClass: "USB 3.0",
    isRemovable: true,
    isSystemDisk: false,
    kind: "HDD",
  },
  {
    id: "disk0s1",
    label: "Macintosh HD",
    mountPath: "/",
    sizeBytes: 1024 * GB,
    usedBytes: 512 * GB,
    fileSystem: "APFS",
    speedClass: "Internal NVMe",
    isRemovable: false,
    isSystemDisk: true,
    kind: "Unknown",
  },
];

export function formatBytes(bytes: number): string {
  if (bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(
    units.length - 1,
    Math.floor(Math.log(bytes) / Math.log(1024))
  );
  const value = bytes / 1024 ** i;
  return `${value.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export function formatSpeed(bps: number): string {
  return `${(bps / (1024 * 1024)).toFixed(1)} MB/s`;
}

export function formatEta(seconds: number): string {
  if (!isFinite(seconds) || seconds <= 0) return "--:--";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}
