import { useEffect, useState } from "react";
import { ChevronRight, Folder, File, Loader2, X } from "lucide-react";
import type { DiskInfo, TreeEntry } from "../../types/disk";
import { listDirectory, dedupeNestedPaths } from "../../lib/folderPicker";
import { formatBytes } from "../../data/mockDisks";
import { useI18n } from "../../i18n";

interface Props {
  disk: DiskInfo;
  initialSelected: string[];
  onCancel: () => void;
  onConfirm: (paths: string[]) => void;
}

interface NodeState {
  children: TreeEntry[] | null; // null = not yet loaded
  loading: boolean;
}

export default function FolderTreeModal({ disk, initialSelected, onCancel, onConfirm }: Props) {
  const { t } = useI18n();
  const [nodes, setNodes] = useState<Record<string, NodeState>>({});
  const [expanded, setExpanded] = useState<Set<string>>(new Set([disk.mountPath]));
  const [selected, setSelected] = useState<Set<string>>(new Set(initialSelected));

  const loadChildren = async (path: string) => {
    setNodes((prev) => ({ ...prev, [path]: { children: prev[path]?.children ?? null, loading: true } }));
    const children = await listDirectory(path, disk);
    setNodes((prev) => ({ ...prev, [path]: { children, loading: false } }));
  };

  useEffect(() => {
    loadChildren(disk.mountPath);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disk.mountPath]);

  const toggleExpand = (path: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
        if (!nodes[path]?.children) loadChildren(path);
      }
      return next;
    });
  };

  const isSelected = (path: string) => selected.has(path);
  const isImplicitlySelected = (path: string) => {
    let cursor = path;
    while (cursor.includes("/")) {
      cursor = cursor.slice(0, cursor.lastIndexOf("/"));
      if (cursor.length < disk.mountPath.length) break;
      if (selected.has(cursor)) return true;
    }
    return false;
  };
  const hasSelectedDescendant = (path: string): boolean => {
    for (const s of selected) {
      if (s !== path && s.startsWith(path + "/")) return true;
    }
    return false;
  };

  const toggleSelect = (entry: TreeEntry) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(entry.path)) {
        next.delete(entry.path);
      } else {
        // Selecting a node makes any already-selected descendants redundant.
        for (const s of Array.from(next)) {
          if (s.startsWith(entry.path + "/")) next.delete(s);
        }
        next.add(entry.path);
      }
      return next;
    });
  };

  const handleConfirm = () => {
    onConfirm(dedupeNestedPaths(Array.from(selected)));
  };

  const renderNode = (entry: TreeEntry, depth: number) => {
    const state = nodes[entry.path];
    const open = expanded.has(entry.path);
    const checked = isSelected(entry.path) || isImplicitlySelected(entry.path);
    const indeterminate = !checked && entry.isDir && hasSelectedDescendant(entry.path);
    const implicit = !isSelected(entry.path) && isImplicitlySelected(entry.path);

    return (
      <div key={entry.path}>
        <div
          className="flex items-center gap-2 py-1.5 rounded-[6px] hover:bg-[var(--bg-elev-2)]"
          style={{ paddingLeft: 8 + depth * 18 }}
        >
          {entry.isDir ? (
            <button
              onClick={() => toggleExpand(entry.path)}
              className="shrink-0 w-4 h-4 flex items-center justify-center"
            >
              <ChevronRight
                size={12}
                style={{
                  color: "var(--text-tertiary)",
                  transform: open ? "rotate(90deg)" : "rotate(0deg)",
                  transition: "transform 0.12s",
                }}
              />
            </button>
          ) : (
            <span className="w-4 shrink-0" />
          )}

          <input
            type="checkbox"
            checked={checked}
            disabled={implicit}
            ref={(el) => {
              if (el) el.indeterminate = indeterminate;
            }}
            onChange={() => toggleSelect(entry)}
            className="shrink-0"
            style={{ accentColor: "var(--accent)", opacity: implicit ? 0.5 : 1 }}
          />

          {entry.isDir ? (
            <Folder size={14} style={{ color: "var(--text-secondary)" }} className="shrink-0" />
          ) : (
            <File size={14} style={{ color: "var(--text-tertiary)" }} className="shrink-0" />
          )}

          <span className="text-[12.5px] truncate flex-1">{entry.name}</span>

          {!entry.isDir && (
            <span className="text-[11px] shrink-0 pr-2" style={{ color: "var(--text-tertiary)" }}>
              {formatBytes(entry.sizeBytes)}
            </span>
          )}
        </div>

        {entry.isDir && open && (
          <div>
            {state?.loading && (
              <div
                className="flex items-center gap-2 py-1.5 text-[11.5px]"
                style={{ paddingLeft: 8 + (depth + 1) * 18, color: "var(--text-tertiary)" }}
              >
                <Loader2 size={12} className="animate-spin" />
                …
              </div>
            )}
            {state?.children?.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const rootState = nodes[disk.mountPath];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-6" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="card w-full max-w-[560px] flex flex-col" style={{ maxHeight: "80vh" }}>
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
          <div>
            <h3 className="text-[14px] font-semibold">{t.clone.selectRangeTitle}</h3>
            <p className="text-[11.5px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
              {disk.label} — {disk.mountPath}
            </p>
          </div>
          <button onClick={onCancel} className="p-1 rounded-[6px] btn-ghost">
            <X size={15} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-2">
          {rootState?.loading && !rootState.children ? (
            <div className="flex items-center justify-center py-10" style={{ color: "var(--text-tertiary)" }}>
              <Loader2 size={16} className="animate-spin" />
            </div>
          ) : rootState?.children?.length === 0 ? (
            <div className="text-[12px] py-8 text-center" style={{ color: "var(--text-tertiary)" }}>
              {t.clone.noFoldersSelected}
            </div>
          ) : (
            rootState?.children?.map((entry) => renderNode(entry, 0))
          )}
        </div>

        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <span className="text-[12px]" style={{ color: "var(--text-secondary)" }}>
            {t.clone.selectedLabel}: {selected.size}
          </span>
          <div className="flex gap-2">
            <button onClick={onCancel} className="btn-ghost rounded-[8px] px-4 py-2 text-[13px]">
              {t.common.cancel}
            </button>
            <button
              onClick={handleConfirm}
              disabled={selected.size === 0}
              className="btn-primary rounded-[8px] px-4 py-2 text-[13px] font-medium"
            >
              {t.common.confirm}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
