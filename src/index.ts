import fs from 'fs';
import { Library, PBBackup, SourceMangas } from 'types/paperbackBackup';

if (require.main === module) {
    main();
}

// Backup JSON parser for now. Will split into separate files or projects?

function main() {
    const rawBackupJson = fs.readFileSync('backupDump/input.json', 'utf8');
    const backupJson: PBBackup = JSON.parse(rawBackupJson);

    const uuids = getUuids(backupJson);

    genSourceList(backupJson, uuids);
}

function getUuids(rawJson: PBBackup): Array<string> {
    const uuids: Array<string> = [];

    rawJson.library.forEach((element: Library) => {
        uuids.push(element.manga.id);
    });

    return uuids;
}

function genSourceList(rawJson: PBBackup, uuids: Array<string>) {
    const titles: Array<string> = [];

    rawJson.sourceMangas.forEach((element: SourceMangas) => {
        if (uuids.includes(element.manga.id)) {
            titles.push(element.manga.titles[0]);
        }
    });

    console.log(titles);
}
