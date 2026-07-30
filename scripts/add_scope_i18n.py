import re

base = "/home/claude/molacard/src/i18n/locales/"

# anchor: the needBothDisks line (unique per file), insert new keys right after it.
inserts = {
"en.ts": (
    '    needBothDisks: "Select both a source and a destination drive to begin.",',
    '''    needBothDisks: "Select both a source and a destination drive to begin.",
    scope: "Copy Scope",
    scopeFull: "Entire Drive",
    scopeFullDesc: "Copy everything on the source drive.",
    scopeFolders: "Selected Folders",
    scopeFoldersDesc: "Copy only the folders you choose.",
    addFolder: "Add Folder…",
    removeFolder: "Remove",
    noFoldersSelected: "No folders selected yet.",
    needFolders: "Select at least one folder to copy.",
    destFolder: "Destination Folder",
    destFolderPlaceholder: "Leave blank to copy to the drive's root",
    browse: "Browse…",
    willImportTo: "Will import to",'''
),
"zh-TW.ts": (
    '    needBothDisks: "請先選擇來源裝置與目標裝置才能開始。",',
    '''    needBothDisks: "請先選擇來源裝置與目標裝置才能開始。",
    scope: "拷貝範圍",
    scopeFull: "整個裝置",
    scopeFullDesc: "複製來源裝置中的所有內容。",
    scopeFolders: "選擇資料夾",
    scopeFoldersDesc: "只複製您指定的資料夾。",
    addFolder: "新增資料夾…",
    removeFolder: "移除",
    noFoldersSelected: "尚未選擇任何資料夾。",
    needFolders: "請至少選擇一個要拷貝的資料夾。",
    destFolder: "目標資料夾",
    destFolderPlaceholder: "留空則複製到裝置根目錄",
    browse: "瀏覽…",
    willImportTo: "將匯入至",'''
),
"zh-CN.ts": (
    '    needBothDisks: "请先选择来源设备与目标设备才能开始。",',
    '''    needBothDisks: "请先选择来源设备与目标设备才能开始。",
    scope: "拷贝范围",
    scopeFull: "整个设备",
    scopeFullDesc: "复制来源设备中的所有内容。",
    scopeFolders: "选择文件夹",
    scopeFoldersDesc: "仅复制您指定的文件夹。",
    addFolder: "添加文件夹…",
    removeFolder: "移除",
    noFoldersSelected: "尚未选择任何文件夹。",
    needFolders: "请至少选择一个要拷贝的文件夹。",
    destFolder: "目标文件夹",
    destFolderPlaceholder: "留空则复制到设备根目录",
    browse: "浏览…",
    willImportTo: "将导入至",'''
),
"ja.ts": (
    '    needBothDisks: "開始するにはソースと宛先の両方のドライブを選択してください。",',
    '''    needBothDisks: "開始するにはソースと宛先の両方のドライブを選択してください。",
    scope: "コピー範囲",
    scopeFull: "ドライブ全体",
    scopeFullDesc: "ソースドライブ内のすべてをコピーします。",
    scopeFolders: "選択したフォルダ",
    scopeFoldersDesc: "指定したフォルダのみコピーします。",
    addFolder: "フォルダを追加…",
    removeFolder: "削除",
    noFoldersSelected: "フォルダが選択されていません。",
    needFolders: "コピーするフォルダを1つ以上選択してください。",
    destFolder: "保存先フォルダ",
    destFolderPlaceholder: "空欄にするとドライブのルートにコピーされます",
    browse: "参照…",
    willImportTo: "インポート先",'''
),
"de.ts": (
    '    needBothDisks: "Bitte Quell- und Ziellaufwerk auswählen, um zu starten.",',
    '''    needBothDisks: "Bitte Quell- und Ziellaufwerk auswählen, um zu starten.",
    scope: "Kopierbereich",
    scopeFull: "Gesamtes Laufwerk",
    scopeFullDesc: "Kopiert alles auf dem Quelllaufwerk.",
    scopeFolders: "Ausgewählte Ordner",
    scopeFoldersDesc: "Kopiert nur die von Ihnen gewählten Ordner.",
    addFolder: "Ordner hinzufügen…",
    removeFolder: "Entfernen",
    noFoldersSelected: "Noch keine Ordner ausgewählt.",
    needFolders: "Wählen Sie mindestens einen Ordner zum Kopieren aus.",
    destFolder: "Zielordner",
    destFolderPlaceholder: "Leer lassen, um in das Stammverzeichnis zu kopieren",
    browse: "Durchsuchen…",
    willImportTo: "Wird importiert nach",'''
),
"fr.ts": (
    '    needBothDisks: "Sélectionnez un disque source et un disque de destination pour commencer.",',
    '''    needBothDisks: "Sélectionnez un disque source et un disque de destination pour commencer.",
    scope: "Portée de la copie",
    scopeFull: "Disque entier",
    scopeFullDesc: "Copie tout le contenu du disque source.",
    scopeFolders: "Dossiers sélectionnés",
    scopeFoldersDesc: "Copie uniquement les dossiers que vous choisissez.",
    addFolder: "Ajouter un dossier…",
    removeFolder: "Retirer",
    noFoldersSelected: "Aucun dossier sélectionné pour le moment.",
    needFolders: "Sélectionnez au moins un dossier à copier.",
    destFolder: "Dossier de destination",
    destFolderPlaceholder: "Laisser vide pour copier à la racine du disque",
    browse: "Parcourir…",
    willImportTo: "Sera importé vers",'''
),
"nl.ts": (
    '    needBothDisks: "Selecteer zowel een bron- als een doelschijf om te beginnen.",',
    '''    needBothDisks: "Selecteer zowel een bron- als een doelschijf om te beginnen.",
    scope: "Kopieerbereik",
    scopeFull: "Volledige schijf",
    scopeFullDesc: "Kopieert alles op de bronschijf.",
    scopeFolders: "Geselecteerde mappen",
    scopeFoldersDesc: "Kopieert alleen de mappen die u kiest.",
    addFolder: "Map toevoegen…",
    removeFolder: "Verwijderen",
    noFoldersSelected: "Nog geen mappen geselecteerd.",
    needFolders: "Selecteer ten minste één map om te kopiëren.",
    destFolder: "Doelmap",
    destFolderPlaceholder: "Leeg laten om naar de hoofdmap van de schijf te kopiëren",
    browse: "Bladeren…",
    willImportTo: "Wordt geïmporteerd naar",'''
),
"ru.ts": (
    '    needBothDisks: "Выберите исходный и целевой диск, чтобы начать.",',
    '''    needBothDisks: "Выберите исходный и целевой диск, чтобы начать.",
    scope: "Область копирования",
    scopeFull: "Весь диск",
    scopeFullDesc: "Копирует всё содержимое исходного диска.",
    scopeFolders: "Выбранные папки",
    scopeFoldersDesc: "Копирует только выбранные вами папки.",
    addFolder: "Добавить папку…",
    removeFolder: "Удалить",
    noFoldersSelected: "Папки ещё не выбраны.",
    needFolders: "Выберите хотя бы одну папку для копирования.",
    destFolder: "Папка назначения",
    destFolderPlaceholder: "Оставьте пустым, чтобы копировать в корень диска",
    browse: "Обзор…",
    willImportTo: "Будет импортировано в",'''
),
}

for fname, (anchor, replacement) in inserts.items():
    path = base + fname
    with open(path, encoding="utf-8") as f:
        content = f.read()
    if anchor not in content:
        print(f"MISSING anchor in {fname}")
        continue
    content = content.replace(anchor, replacement)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
print("done")
