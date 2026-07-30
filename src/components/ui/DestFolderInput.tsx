import { FolderOpen } from "lucide-react";
import type { DiskInfo } from "../../types/disk";
import { useI18n } from "../../i18n";
import { pickFolders, relativeTo, joinPath } from "../../lib/folderPicker";
import { isTauri } from "../../lib/tauri";

interface Props {
  destDisk: DiskInfo;
  subfolder: string; // relative path under destDisk.mountPath, "" = root
  onSubfolderChange: (subfolder: string) => void;
  disabled?: boolean;
}

export default function DestFolderInput({ destDisk, subfolder, onSubfolderChange, disabled }: Props) {
  const { t } = useI18n();

  const handleBrowse = async () => {
    const picked = await pickFolders(destDisk.mountPath, false);
    if (picked && picked[0]) {
      onSubfolderChange(relativeTo(picked[0], destDisk.mountPath));
    }
  };

  const resolvedPath = subfolder ? joinPath(destDisk.mountPath, subfolder) : destDisk.mountPath;

  return (
    <div className="card p-4">
      <div className="text-[12px] font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--text-secondary)" }}>
        {t.clone.destFolder}
      </div>
      <div className="flex items-center gap-2 mb-2">
        <input
          className="input flex-1 rounded-[8px] px-3 py-2 text-[13px]"
          placeholder={t.clone.destFolderPlaceholder}
          value={subfolder}
          onChange={(e) => onSubfolderChange(e.target.value)}
          disabled={disabled}
        />
        {isTauri() && (
          <button
            onClick={handleBrowse}
            disabled={disabled}
            className="btn-ghost flex items-center gap-1.5 rounded-[8px] px-3 py-2 text-[12.5px] shrink-0"
          >
            <FolderOpen size={14} />
            {t.clone.browse}
          </button>
        )}
      </div>
      <div className="text-[11.5px] truncate" style={{ color: "var(--text-tertiary)", fontFamily: "ui-monospace, monospace" }}>
        {t.clone.willImportTo}: {resolvedPath}
      </div>
    </div>
  );
}
