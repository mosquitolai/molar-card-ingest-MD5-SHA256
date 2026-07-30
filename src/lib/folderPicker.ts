import { isTauri, safeInvoke } from "./tauri";
import type { DiskInfo, TreeEntry } from "../types/disk";
import { mockListDirectory } from "../data/mockFileTree";

/**
 * Opens the native macOS folder picker, scoped to `defaultPath`.
 * Returns `null` when not running inside Tauri (e.g. `npm run dev` in a
 * plain browser) — callers should fall back to a manual text input in that
 * case, since there is no native filesystem access to defer to.
 */
export async function pickFolders(
  defaultPath: string,
  multiple: boolean
): Promise<string[] | null> {
  if (!isTauri()) return null;
  try {
    const { open } = await import("@tauri-apps/plugin-dialog");
    const result = await open({ directory: true, multiple, defaultPath });
    if (!result) return null;
    return Array.isArray(result) ? result : [result];
  } catch (err) {
    console.error("pickFolders failed", err);
    return null;
  }
}

/**
 * Lists the immediate children of `path` — used to lazily populate the
 * in-app folder/file tree browser ("select range"). Falls back to a small
 * mock tree when previewing outside Tauri.
 */
export async function listDirectory(path: string, disk: DiskInfo): Promise<TreeEntry[]> {
  if (isTauri()) {
    const result = await safeInvoke<TreeEntry[]>("list_directory", { path });
    return result ?? [];
  }
  return mockListDirectory(path, disk);
}

/** Returns the last path segment, e.g. "/Volumes/SD/DCIM" -> "DCIM". */
export function basename(path: string): string {
  const trimmed = path.replace(/\/+$/, "");
  const idx = trimmed.lastIndexOf("/");
  return idx >= 0 ? trimmed.slice(idx + 1) : trimmed;
}

/** Returns `path` relative to `root`, without a leading slash. */
export function relativeTo(path: string, root: string): string {
  const normRoot = root.replace(/\/+$/, "");
  if (path === normRoot) return "";
  if (path.startsWith(normRoot + "/")) return path.slice(normRoot.length + 1);
  return path;
}

/** Joins path segments with a single "/", tolerant of trailing/leading slashes. */
export function joinPath(...parts: string[]): string {
  return parts
    .filter(Boolean)
    .map((p, i) => (i === 0 ? p.replace(/\/+$/, "") : p.replace(/^\/+|\/+$/g, "")))
    .join("/");
}

/**
 * Given a set of checked paths from the tree browser, drops any path whose
 * ancestor is also selected — e.g. if a whole folder and one of its files
 * are both checked, only the folder needs to be copied.
 */
export function dedupeNestedPaths(paths: string[]): string[] {
  const sorted = [...paths].sort((a, b) => a.length - b.length);
  const kept: string[] = [];
  for (const p of sorted) {
    if (!kept.some((k) => p === k || p.startsWith(k + "/"))) {
      kept.push(p);
    }
  }
  return kept;
}
