import { promises as fs } from 'fs';
import { MangaEntry } from 'mangaupdates-server';
import { removeExtraChars } from 'mangaupdates-server/dist/utils';
import { Prompt } from 'prompt-sync';
import { Library, PBBackup, SourceMangas } from './types';
import { sleep } from './utils';

export async function handlePaperback(prompt: Prompt): Promise<Array<MangaEntry>> {
    console.clear();
    console.log('Paperback backup conversion \n');

    let rawBackupJson;

    // Read the backup text file and send it to the parser
    while (true) {
        console.log(
            'To convert a paperback backup, Please put your backup.json in the same directory'
        );
        console.log('as this executable and rename it to paperback.json. \n');
        console.log('Hit enter once you have finished this task.');
        prompt('> ');

        try {
            rawBackupJson = await fs.readFile('./paperback.json', 'utf8');
        } catch (e) {
            console.log("Looks like your paperback backup JSON couldn't be read!");
            console.log(
                'Make sure you have your backup JSON in the same folder as this executable and name it paperback.json! (case sensitive)'
            );
            await sleep(2000);

            console.clear();
            continue;
        }

        break;
    }

    const backupJson: PBBackup = JSON.parse(rawBackupJson);

    const uuids = getUuids(backupJson);
    const mangas = genSourceList(backupJson, uuids);

    console.log('JSON parsing complete.');
    await sleep(3000);

    return mangas;
}

// Generates an array of UUIDs from the library section of the backup
function getUuids(rawJson: PBBackup): Array<string> {
    const uuids: Array<string> = [];

    for (const element of rawJson.library) {
        uuids.push(element.manga.id);
    }

    return uuids;
}

/*
 * Generates an array of UUIDs from the library section of the backup
 *
 * Then saves the titles and returns them
 */
function genSourceList(rawJson: PBBackup, uuids: Array<string>): Array<MangaEntry> {
    const titles: Array<MangaEntry> = [];

    for (const element of rawJson.sourceMangas) {
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
    }

    return titles;
}
