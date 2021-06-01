import { promises as fs } from 'fs';
import { MangaPacket } from 'types/sourceEntries';
import { UserJson } from 'types/userJson';
import { fetchMangaDex } from './SourceUpdates/MangaDex';
import { fetchMangaFox } from './SourceUpdates/MangaFox';
import { fetchMangaLife } from './SourceUpdates/MangaLife';

if (require.main === module) {
    main();
}

// Future home for web server

async function main() {
    /* Manga entry for testing the filter system
    const testEntry: MangaPacket = {
        Name: 'My Hero Academia',
        Chapter: '125',
        TimeElapsed: 300,
        Source: 'MangaLife'
    };
    */

    // Empty array of updates from all sources
    const updateArray: Array<MangaPacket> = [];
    const userConfig = await fetchUserJson();

    // Fetches updates from Manga4Life
    const mangaLife = await fetchMangaLife();
    updateArray.concat(mangaLife);

    // Fetches updates from MangaFox
    const mangaFox = await fetchMangaFox();
    updateArray.concat(mangaFox);

    // Fetches updates from MangaDex
    const mangaDex = await fetchMangaDex();
    updateArray.concat(mangaDex);

    /*
     * Iterates through each entry in the User configuration.
     *
     * If the user entry's title and source is found in the updates list, send a notification.
     */
    userConfig.mangas.forEach((userEntry) => {
        console.log(
            `Original element title: ${userEntry.title} \nOriginal element source: ${userEntry.source} \n`
        );

        const result = updateArray.find((updateEntry) => {
            return userEntry.title === updateEntry.Name && userEntry.source === updateEntry.Source;
        });

        if (result === undefined) {
            console.log(`No updates found for ${userEntry.title}`);
        } else {
            console.log(`Sending chapter: ${result.Chapter} of ${result.Name}`);
        }
    });
}

// Fetches user configuration.
async function fetchUserJson(): Promise<UserJson> {
    const file = await fs.readFile('backupDump/encodedManga.json', 'utf8');
    const userJson = JSON.parse(file);

    return userJson;
}
