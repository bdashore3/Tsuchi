import { promises as fs } from 'fs';
import { MangaPacket } from 'types/sourceEntries';
import { UserJson } from 'types/userJson';
import { fetchMangaDex } from './SourceUpdates/MangaDex';
import { checkCache, flushCache, updateCache } from './cache';
import { fetchMangaFox } from './SourceUpdates/MangaFox';
import { fetchMangaLife } from './SourceUpdates/MangaLife';
import sendIfttt from './NotificationHandler/ifttt';
import sendSpontit from './NotificationHandler/spontit';

if (require.main === module) {
    main();
}

async function main() {
    const flushCacheTask = setInterval(() => flushCache(), 5000);

    /* Manga entry for testing the filter system */
    /*
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

        const updateResult = updateArray.find((i) => {
            return userEntry.title === i.Name && userEntry.source === i.Source;
        });

        // Remove once sending is added
        if (updateResult === undefined) {
            console.log(`No updates found for ${userEntry.title}`);
        } else {
            // If there is a hit in the cache, bail.
            const cacheHit = checkCache(updateResult);

            if (!cacheHit) {
                updateCache(updateResult);

                // Placeholder for sending logic
                console.log(`Sending chapter: ${updateResult.Chapter} of ${updateResult.Name}`);

                handleServices(userConfig, updateResult);
            }
        }
    });
}

/* eslint-disable @typescript-eslint/no-non-null-assertion */
function handleServices(userConfig: UserJson, payload: MangaPacket) {
    userConfig.services.forEach(async (name) => {
        switch (name) {
            case 'ifttt':
                await sendIfttt(userConfig.ifttt!.event_name, userConfig.ifttt!.key, payload);
                break;
            case 'spontit':
                await sendSpontit(
                    userConfig.spontit!.userId,
                    userConfig.spontit!.secretKey,
                    payload
                );
                break;
        }
    });
}

// Fetches user configuration.
async function fetchUserJson(): Promise<UserJson> {
    const file = await fs.readFile('backupDump/encodedManga.json', 'utf8');
    const userJson = JSON.parse(file);

    return userJson;
}
