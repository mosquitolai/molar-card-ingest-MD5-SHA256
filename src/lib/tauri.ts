// Small helper to detect whether the app is currently running inside the
// Tauri shell (native window) versus a plain browser (`npm run dev` / web
// preview). When running in a browser we fall back to mock data so the UI
// can be designed and tested without compiling the Rust backend.

export function isTauri(): boolean {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

export async function safeInvoke<T>(
  cmd: string,
  args?: Record<string, unknown>
): Promise<T | null> {
  if (!isTauri()) return null;
  try {
    const { invoke } = await import("@tauri-apps/api/core");
    return (await invoke(cmd, args)) as T;
  } catch (err) {
    console.error(`invoke(${cmd}) failed`, err);
    return null;
  }
}

export async function safeListen<T>(
  event: string,
  handler: (payload: T) => void
): Promise<() => void> {
  if (!isTauri()) return () => {};
  const { listen } = await import("@tauri-apps/api/event");
  const unlisten = await listen<T>(event, (e) => handler(e.payload));
  return unlisten;
}
