import { promises as fs } from 'fs';
import { MangaPacket } from 'types/sourceEntries';
import { UserJson } from 'types/userJson';
import { checkCache, flushCache, updateCache } from './cache';
// import { fetchMangaDex } from './SourceUpdates/MangaDex';
import { fetchMangaFox } from './SourceUpdates/MangaFox';
import { fetchMangaLife } from './SourceUpdates/MangaLife';
import { fetchMangaKakalot } from './SourceUpdates/MangaKakalot';
import sendIfttt from './NotificationHandler/ifttt';
import sendSpontit from './NotificationHandler/spontit';

if (require.main === module) {
    main();
}

async function main() {
    // Flush the cache every 12 hours to remove leftovers
    setInterval(() => flushCache(), 43200000);

    // Dispatch updates on an interval. Disabled for now due to testing.
    /*
    const updateDispatchTask = setInterval(async () => {
        await dispatchUpdateEvent();
    }, 900000);
    */

    await dispatchUpdateEvent();
}

async function dispatchUpdateEvent() {
    // Manga entry for testing the filter system
    /*
    const testEntry: MangaPacket = {
        Name: 'My Hero Academia',
        Chapter: '125',
        TimeElapsed: 300,
        Source: 'MangaLife'
    };
    */

    const users = await fs.readdir('users').catch((_e) => {
        console.log('No users in the directory!');
    });

    if (!users) {
        return;
    }

    const updates = await fetchUpdates();
    // updates.push(testEntry);

    users.forEach(async (userFile) => {
        const userConfig = await fetchUserJson(userFile);
        dispatchToUser(userConfig, updates);
    });
}

async function fetchUpdates(): Promise<Array<MangaPacket>> {
    // Empty array of updates from all sources
    const updateArray: Array<MangaPacket> = [];

    // Fetches updates from Manga4Life
    const mangaLife = await fetchMangaLife();
    updateArray.concat(mangaLife);

    // Fetches updates from MangaFox
    const mangaFox = await fetchMangaFox();
    updateArray.concat(mangaFox);

    // Fetches updates from MangaKakalot
    const mangaKakalot = await fetchMangaKakalot();
    updateArray.concat(mangaKakalot);

    return updateArray;
}

/*
 * Iterates through each entry in the User configuration.
 *
 * If the user entry's title and source is found in the updates list, send a notification.
 */
function dispatchToUser(userConfig: UserJson, updates: Array<MangaPacket>) {
    userConfig.mangas.forEach((userEntry) => {
        console.log(
            `Original element title: ${userEntry.title} \nOriginal element source: ${userEntry.source} \n`
        );

        const updateResult = updates.find((i) => {
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
async function fetchUserJson(userFile: string): Promise<UserJson> {
    const file = await fs.readFile(`users/${userFile}`, 'utf8');
    const userJson = JSON.parse(file);

    return userJson;
}
