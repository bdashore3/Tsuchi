import { promises as fs } from 'fs';
import { MangaEntry, UserJson } from 'types/userJson';
import { Library, PBBackup, SourceMangas } from 'types/paperbackBackup';

if (require.main === module) {
    main();
}

async function main() {
    const username = process.argv[2];
    if (username === '' || username === undefined) {
        console.log('Please provide a username in the first argument position!');

        return;
    }

    let userConfig: UserJson | undefined;
    try {
        userConfig = await fetchUserJson(username);
    } catch (e) {
        console.log(
            "I tried getting your config, but it isn't there? \nCheck the entered username or run setup first!"
        );
    }

    if (userConfig === undefined) {
        return;
    }

    // Read the backup JSON file and cast it to a PBBackup type
    const rawBackupJson = await fs.readFile('backupDump/input.json', 'utf8');
    const backupJson: PBBackup = JSON.parse(rawBackupJson);

    const uuids = getUuids(backupJson);

    const mangas = genSourceList(backupJson, uuids);

    userConfig.mangas = mangas;

    await fs.writeFile(`users/${userConfig.user}.json`, JSON.stringify(userConfig, null, 2));
}

async function fetchUserJson(username: string): Promise<UserJson> {
    const file = await fs.readFile(`users/${username}.json`, 'utf8');
    const userJson = JSON.parse(file);

    return userJson;
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
        } else if (['mangakakalot', 'manganelo'].includes(source.toLowerCase())) {
            source = 'mangakakalot';
        } else {
            source = source.toLowerCase();
        }

        if (uuids.includes(element.manga.id) && (element.manga.status == 1)) {
            titles.push({
                title: element.manga.titles[0],
                source: source
            });
        }
    });

    return titles;
}
