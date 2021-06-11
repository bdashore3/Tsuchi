import { promises as fs } from 'fs';
import { MangaEntry } from 'mangaupdates-server';
import { fetchUserJson, removeExtraChars } from 'mangaupdates-server/src/utils';
import { Library, PBBackup, SourceMangas } from '../types';

if (require.main === module) {
    main();
}

async function main() {
    const username = process.argv[2];
    if (username === '' || username === undefined) {
        console.log('Please provide a username in the first argument position!');

        return;
    }

    const userConfig = await fetchUserJson(`${username}.json`).catch(() => {
        console.log(
            "I tried getting your config, but it isn't there? \nCheck the entered username or run setup first!"
        );
    });

    if (!userConfig) {
        return;
    }

    // Read the backup JSON file and cast it to a PBBackup type
    const rawBackupJson = await fs.readFile('backupDump/paperback.json', 'utf8');
    const backupJson: PBBackup = JSON.parse(rawBackupJson);

    const uuids = getUuids(backupJson);

    const mangas = genSourceList(backupJson, uuids);

    userConfig.mangas = mangas;

    await fs.writeFile(`users/${userConfig.user}.json`, JSON.stringify(userConfig, null, 2));
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
        let source = element.sourceId;

        if (['mangasee', 'mangalife'].includes(source.toLowerCase())) {
            source = 'mangalife';
        } else {
            source = source.toLowerCase();
        }

        if (uuids.includes(element.manga.id) && element.manga.status == 1) {
            titles.push({
                title: removeExtraChars(element.manga.titles[0]),
                source: source
            });
        }
    });

    return titles;
}