import fs from 'fs';
import promptSync from 'prompt-sync';
import { MangaEntry, UserJson } from 'types/userJson';
import { Library, PBBackup, SourceMangas } from 'types/paperbackBackup';

if (require.main === module) {
    main();
}

function main() {
    const prompt = promptSync();

    // Synchronously read the JSON file and cast it to a PBBackup type
    const rawBackupJson = fs.readFileSync('backupDump/input.json', 'utf8');
    const backupJson: PBBackup = JSON.parse(rawBackupJson);

    let username;

    while (username === null || username === undefined || username === '') {
        console.log(typeof username);

        username = prompt('What is your username? ');

        if (username === null || username === '') {
            console.log('Please provide a valid username!');
        }
    }

    const uuids = getUuids(backupJson);

    const mangas = genSourceList(backupJson, uuids);

    const mangaJson: UserJson = {
        user: username,
        mangas: mangas
    };

    fs.writeFileSync('backupDump/encodedManga.json', JSON.stringify(mangaJson, null, 2));
}

// Generates an array of UUIDs from the library section of the backup
function getUuids(rawJson: PBBackup): Array<string> {
    const uuids: Array<string> = [];

    rawJson.library.forEach((element: Library) => {
        uuids.push(element.manga.id);
    });

    return uuids;
}

/*
 * Generates an array of UUIDs from the library section of the backup
 *
 * Then saves the titles and returns them
 */
function genSourceList(rawJson: PBBackup, uuids: Array<string>): Array<MangaEntry> {
    const titles: Array<MangaEntry> = [];

    rawJson.sourceMangas.forEach((element: SourceMangas) => {
        if (uuids.includes(element.manga.id)) {
            titles.push({
                title: element.manga.titles[0],
                source: element.sourceId
            });
        }
    });

    return titles;
}
