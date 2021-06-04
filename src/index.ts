import { promises as fs } from 'fs';
import { MangaPacket } from 'types/sourceEntries';
import { UserJson } from 'types/userJson';
import { checkCache, flushCache } from './cache';
// import fetchMangaDex from './SourceUpdates/MangaDex';
import fetchMangaFox from './SourceUpdates/MangaFox';
import fetchMangaLife from './SourceUpdates/MangaLife';
import fetchMangaKakalot from './SourceUpdates/MangaKakalot';
import sendIfttt from './NotificationHandler/ifttt';
import sendSpontit from './NotificationHandler/spontit';

if (require.main === module) {
    main();
}

async function main() {
    console.log('Starting update service...');

    // Flush the cache every 12 hours to remove leftovers
    setInterval(() => flushCache(), 43200000);

    // Initial dispatch update call
    await dispatchUpdateEvent();

    // Dispatch updates on an interval every 30 minutes.
    setInterval(async () => {
        await dispatchUpdateEvent();
    }, 1.8e6);

    console.log('Update interval successfully set');
}

async function dispatchUpdateEvent() {
    const users = await fs.readdir('users').catch((_e) => {
        console.log('No users in the directory!');
    });

    if (!users) {
        return;
    }

    const updates = await fetchUpdates();

    users.forEach(async (userFile) => {
        const userConfig = await fetchUserJson(userFile);
        dispatchToUser(userConfig, updates);
    });
}

async function fetchUpdates(): Promise<Array<MangaPacket>> {
    // Empty array of updates from all sources
    let updateArray: Array<MangaPacket> = [];

    // Fetches updates from Manga4Life
    const mangaLife = await fetchMangaLife();
    updateArray = updateArray.concat(mangaLife);

    // Fetches updates from MangaFox
    const mangaFox = await fetchMangaFox();
    updateArray = updateArray.concat(mangaFox);

    // Fetches updates from MangaKakalot
    const mangaKakalot = await fetchMangaKakalot();
    updateArray = updateArray.concat(mangaKakalot);

    return updateArray;
}

/*
 * Iterates through each entry in the User configuration.
 *
 * If the user entry's title and source is found in the updates list, send a notification.
 */
function dispatchToUser(userConfig: UserJson, updates: Array<MangaPacket>) {
    let success = 0;
    const total = userConfig.mangas.length;

    console.log();
    console.log(`Evaluating mangas for ${userConfig.user}`);

    userConfig.mangas.forEach((userEntry) => {
        const updateResult = updates.find((i) => {
            return userEntry.title === i.Name && userEntry.source === i.Source;
        });

        if (updateResult !== undefined) {
            // If there is a hit in the cache, bail.
            const cacheHit = checkCache(updateResult);

            if (!cacheHit) {
                success++;
                console.log(
                    `Sending notification for ${updateResult.Name} from ${updateResult.Source}`
                );

                handleServices(userConfig, updateResult);
            }
        }
    });

    console.log(`${success} updates from a total of ${total} manga(s)`);
    console.log();
}

// Handles dispatch to notification services.
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
