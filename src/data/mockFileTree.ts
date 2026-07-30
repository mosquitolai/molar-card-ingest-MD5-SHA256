import type { DiskInfo, TreeEntry } from "../types/disk";

// A file is represented by its size in bytes (number). A directory is a
// nested object (possibly empty, meaning "empty folder"). This is only used
// as a stand-in when previewing the UI outside of Tauri (`npm run dev`),
// where there's no real filesystem to browse.
type MockNode = number | { [name: string]: MockNode };

const sdCardTree: Record<string, MockNode> = {
  DCIM: {
    "100MSDCF": {
      "DSC00001.ARW": 24_800_000,
      "DSC00001.JPG": 8_200_000,
      "DSC00002.ARW": 25_100_000,
      "DSC00002.JPG": 8_400_000,
      "DSC00003.ARW": 24_950_000,
      "DSC00003.JPG": 8_150_000,
    },
    "101MSDCF": {
      "DSC00120.ARW": 26_000_000,
      "DSC00120.JPG": 8_600_000,
    },
  },
  "MISC": {},
  "PRIVATE": {
    "M4ROOT": {
      CLIP: {
        "C0001.MP4": 512_000_000,
        "C0002.MP4": 480_000_000,
      },
    },
  },
};

const usbOrHddTree: Record<string, MockNode> = {
  Documents: {
    "Report.docx": 45_000,
    "Budget.xlsx": 32_000,
    "Notes.txt": 2_400,
  },
  Photos: {
    "2025": {
      "IMG_0001.HEIC": 3_400_000,
      "IMG_0002.HEIC": 2_900_000,
      "IMG_0003.HEIC": 3_100_000,
    },
    "2026": {
      "IMG_1000.HEIC": 3_600_000,
      "IMG_1001.HEIC": 3_300_000,
    },
  },
  Backups: {
    "TimeMachine.sparsebundle": 0,
  },
  "README.txt": 1_200,
};

function treeRootFor(disk: DiskInfo): Record<string, MockNode> {
  if (disk.kind === "SD" || disk.kind === "MicroSD" || disk.kind === "CFexpress") {
    return sdCardTree;
  }
  return usbOrHddTree;
}

function joinMock(base: string, name: string): string {
  return base.replace(/\/+$/, "") + "/" + name;
}

/** Mimics the Rust `list_directory` command for browser-preview mode. */
export function mockListDirectory(path: string, disk: DiskInfo): TreeEntry[] {
  const root = disk.mountPath.replace(/\/+$/, "");
  const rel = path.replace(/\/+$/, "") === root ? "" : path.replace(root + "/", "");
  const segments = rel ? rel.split("/") : [];

  let node: Record<string, MockNode> = treeRootFor(disk);
  for (const seg of segments) {
    const next = node[seg];
    if (next && typeof next === "object") {
      node = next;
    } else {
      return [];
    }
  }

  return Object.entries(node)
    .map(([name, value]) => {
      const isDir = typeof value === "object";
      return {
        name,
        path: joinMock(path, name),
        isDir,
        sizeBytes: isDir ? 0 : (value as number),
      };
    })
    .sort((a, b) => (a.isDir === b.isDir ? a.name.localeCompare(b.name) : a.isDir ? -1 : 1));
}
