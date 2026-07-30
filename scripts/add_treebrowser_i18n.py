replacements = {
"en.ts": ('    addFolder: "Add Folder…",',
          '    addFolder: "Select Range…",\n    selectRangeTitle: "Select Range",\n    selectedLabel: "Selected",'),
"zh-TW.ts": ('    addFolder: "新增資料夾…",',
          '    addFolder: "匡選範圍…",\n    selectRangeTitle: "匡選範圍",\n    selectedLabel: "已選取",'),
"zh-CN.ts": ('    addFolder: "添加文件夹…",',
          '    addFolder: "框选范围…",\n    selectRangeTitle: "框选范围",\n    selectedLabel: "已选择",'),
"ja.ts": ('    addFolder: "フォルダを追加…",',
          '    addFolder: "範囲を選択…",\n    selectRangeTitle: "範囲を選択",\n    selectedLabel: "選択済み",'),
"de.ts": ('    addFolder: "Ordner hinzufügen…",',
          '    addFolder: "Bereich auswählen…",\n    selectRangeTitle: "Bereich auswählen",\n    selectedLabel: "Ausgewählt",'),
"fr.ts": ('    addFolder: "Ajouter un dossier…",',
          '    addFolder: "Sélectionner une plage…",\n    selectRangeTitle: "Sélectionner une plage",\n    selectedLabel: "Sélectionné",'),
"nl.ts": ('    addFolder: "Map toevoegen…",',
          '    addFolder: "Bereik selecteren…",\n    selectRangeTitle: "Bereik selecteren",\n    selectedLabel: "Geselecteerd",'),
"ru.ts": ('    addFolder: "Добавить папку…",',
          '    addFolder: "Выбрать диапазон…",\n    selectRangeTitle: "Выбор диапазона",\n    selectedLabel: "Выбрано",'),
}

base = "/home/claude/molacard/src/i18n/locales/"
for fname, (old, new) in replacements.items():
    path = base + fname
    with open(path, encoding="utf-8") as f:
        content = f.read()
    if old not in content:
        print("MISSING", fname)
        continue
    content = content.replace(old, new)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
print("done")
