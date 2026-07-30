import re

replacements = {
"en.ts": [
    ('    manager: "Card Manager",', '    manager: "Drive Manager",'),
    ('    source: "Source Card",', '    source: "Source Drive",'),
    ('    destination: "Destination Card / Path",', '    destination: "Destination Drive / Path",'),
    ('    subtitle: "Duplicate a memory card, byte for byte or file for file.",',
     '    subtitle: "Duplicate a USB drive, external hard disk, or memory card, byte for byte or file for file.",'),
    ('    title: "Card Manager",', '    title: "Drive Manager",'),
    ('    warningBody: "You are about to erase all content on this card. This action cannot be undone.",',
     '    warningBody: "You are about to erase all content on this drive. This action cannot be undone.",'),
    ('    typeToConfirm: "Type the card name below to enable the erase button",',
     '    typeToConfirm: "Type the drive name below to enable the erase button",'),
    ('    typePlaceholder: "Type card name exactly",', '    typePlaceholder: "Type drive name exactly",'),
],
"zh-TW.ts": [
    ('    manager: "卡片管理",', '    manager: "裝置管理",'),
    ('    source: "來源卡",', '    source: "來源裝置",'),
    ('    destination: "目標卡 / 備份路徑",', '    destination: "目標裝置 / 備份路徑",'),
    ('    subtitle: "將記憶卡完整複製到另一張卡片或備份路徑。",',
     '    subtitle: "將隨身碟、外接硬碟或記憶卡完整複製到另一個裝置或備份路徑。",'),
    ('    title: "卡片管理",', '    title: "裝置管理",'),
    ('    warningBody: "您即將清空此卡片上的所有內容，此動作無法復原。",',
     '    warningBody: "您即將清空此裝置上的所有內容，此動作無法復原。",'),
    ('    typeToConfirm: "請在下方輸入卡片名稱以啟用清除按鈕",', '    typeToConfirm: "請在下方輸入裝置名稱以啟用清除按鈕",'),
    ('    typePlaceholder: "請完整輸入卡片名稱",', '    typePlaceholder: "請完整輸入裝置名稱",'),
],
"zh-CN.ts": [
    ('    manager: "卡片管理",', '    manager: "设备管理",'),
    ('    source: "来源卡",', '    source: "来源设备",'),
    ('    destination: "目标卡 / 备份路径",', '    destination: "目标设备 / 备份路径",'),
    ('    subtitle: "将存储卡完整复制到另一张卡片或备份路径。",',
     '    subtitle: "将 U 盘、外接硬盘或存储卡完整复制到另一个设备或备份路径。",'),
    ('    title: "卡片管理",', '    title: "设备管理",'),
    ('    warningBody: "您即将清空此卡片上的所有内容，此操作无法撤销。",',
     '    warningBody: "您即将清空此设备上的所有内容，此操作无法撤销。",'),
    ('    typeToConfirm: "请在下方输入卡片名称以启用清除按钮",', '    typeToConfirm: "请在下方输入设备名称以启用清除按钮",'),
    ('    typePlaceholder: "请完整输入卡片名称",', '    typePlaceholder: "请完整输入设备名称",'),
],
"ja.ts": [
    ('    manager: "カード管理",', '    manager: "ドライブ管理",'),
    ('    source: "ソースカード",', '    source: "ソースドライブ",'),
    ('    destination: "宛先カード / 保存先",', '    destination: "宛先ドライブ / 保存先",'),
    ('    subtitle: "メモリーカードを別のカードや保存先に複製します。",',
     '    subtitle: "USBドライブ、外付けハードディスク、またはメモリーカードを別のドライブや保存先に複製します。",'),
    ('    title: "カード管理",', '    title: "ドライブ管理",'),
    ('    warningBody: "このカードのすべての内容を消去しようとしています。この操作は元に戻せません。",',
     '    warningBody: "このドライブのすべての内容を消去しようとしています。この操作は元に戻せません。",'),
    ('    typeToConfirm: "消去ボタンを有効にするには、下にカード名を入力してください",',
     '    typeToConfirm: "消去ボタンを有効にするには、下にドライブ名を入力してください",'),
    ('    typePlaceholder: "カード名を正確に入力",', '    typePlaceholder: "ドライブ名を正確に入力",'),
],
"de.ts": [
    ('    manager: "Kartenverwaltung",', '    manager: "Laufwerksverwaltung",'),
    ('    source: "Quellkarte",', '    source: "Quelllaufwerk",'),
    ('    destination: "Zielkarte / Pfad",', '    destination: "Ziellaufwerk / Pfad",'),
    ('    subtitle: "Speicherkarte 1:1 auf eine andere Karte oder ein Ziel kopieren.",',
     '    subtitle: "USB-Laufwerk, externe Festplatte oder Speicherkarte 1:1 auf ein anderes Laufwerk oder Ziel kopieren.",'),
    ('    title: "Kartenverwaltung",', '    title: "Laufwerksverwaltung",'),
    ('    warningBody: "Sie sind dabei, den gesamten Inhalt dieser Karte zu löschen. Dies kann nicht rückgängig gemacht werden.",',
     '    warningBody: "Sie sind dabei, den gesamten Inhalt dieses Laufwerks zu löschen. Dies kann nicht rückgängig gemacht werden.",'),
    ('    typeToConfirm: "Geben Sie unten den Kartennamen ein, um die Löschtaste zu aktivieren",',
     '    typeToConfirm: "Geben Sie unten den Laufwerksnamen ein, um die Löschtaste zu aktivieren",'),
    ('    typePlaceholder: "Kartennamen exakt eingeben",', '    typePlaceholder: "Laufwerksnamen exakt eingeben",'),
],
"fr.ts": [
    ('    manager: "Gestion des cartes",', '    manager: "Gestion des disques",'),
    ('    source: "Carte source",', '    source: "Disque source",'),
    ('    destination: "Carte / chemin de destination",', '    destination: "Disque / chemin de destination",'),
    ('    subtitle: "Dupliquez une carte mémoire vers une autre carte ou un dossier.",',
     '    subtitle: "Dupliquez une clé USB, un disque dur externe ou une carte mémoire vers un autre disque ou dossier.",'),
    ('    title: "Gestion des cartes",', '    title: "Gestion des disques",'),
    ('    warningBody: "Vous êtes sur le point d\'effacer tout le contenu de cette carte. Cette action est irréversible.",',
     '    warningBody: "Vous êtes sur le point d\'effacer tout le contenu de ce disque. Cette action est irréversible.",'),
    ('    typeToConfirm: "Saisissez le nom de la carte ci-dessous pour activer le bouton d\'effacement",',
     '    typeToConfirm: "Saisissez le nom du disque ci-dessous pour activer le bouton d\'effacement",'),
    ('    typePlaceholder: "Saisissez le nom exact de la carte",', '    typePlaceholder: "Saisissez le nom exact du disque",'),
],
"nl.ts": [
    ('    manager: "Kaartbeheer",', '    manager: "Schijfbeheer",'),
    ('    source: "Bronkaart",', '    source: "Bronschijf",'),
    ('    destination: "Doelkaart / pad",', '    destination: "Doelschijf / pad",'),
    ('    subtitle: "Dupliceer een geheugenkaart naar een andere kaart of locatie.",',
     '    subtitle: "Dupliceer een USB-stick, externe harde schijf of geheugenkaart naar een andere schijf of locatie.",'),
    ('    title: "Kaartbeheer",', '    title: "Schijfbeheer",'),
    ('    warningBody: "U staat op het punt alle inhoud van deze kaart te wissen. Dit kan niet ongedaan worden gemaakt.",',
     '    warningBody: "U staat op het punt alle inhoud van deze schijf te wissen. Dit kan niet ongedaan worden gemaakt.",'),
    ('    typeToConfirm: "Typ hieronder de kaartnaam om de wisknop te activeren",',
     '    typeToConfirm: "Typ hieronder de schijfnaam om de wisknop te activeren",'),
    ('    typePlaceholder: "Typ de kaartnaam exact",', '    typePlaceholder: "Typ de schijfnaam exact",'),
],
"ru.ts": [
    ('    manager: "Управление картами",', '    manager: "Управление дисками",'),
    ('    source: "Исходная карта",', '    source: "Исходный диск",'),
    ('    destination: "Карта / путь назначения",', '    destination: "Диск / путь назначения",'),
    ('    subtitle: "Дублирование карты памяти на другую карту или в папку.",',
     '    subtitle: "Дублирование USB-накопителя, внешнего жёсткого диска или карты памяти на другой диск или в папку.",'),
    ('    title: "Управление картами",', '    title: "Управление дисками",'),
    ('    warningBody: "Вы собираетесь удалить всё содержимое этой карты. Это действие необратимо.",',
     '    warningBody: "Вы собираетесь удалить всё содержимое этого диска. Это действие необратимо.",'),
    ('    typeToConfirm: "Введите имя карты ниже, чтобы включить кнопку удаления",',
     '    typeToConfirm: "Введите имя диска ниже, чтобы включить кнопку удаления",'),
    ('    typePlaceholder: "Введите имя карты точно",', '    typePlaceholder: "Введите имя диска точно",'),
],
}

base = "/home/claude/molacard/src/i18n/locales/"
for fname, pairs in replacements.items():
    path = base + fname
    with open(path, encoding="utf-8") as f:
        content = f.read()
    for old, new in pairs:
        if old not in content:
            print(f"MISSING in {fname}: {old!r}")
            continue
        content = content.replace(old, new)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
print("done")
