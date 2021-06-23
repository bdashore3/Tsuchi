import { promises as fs } from 'fs';
import axios from 'axios';
import { UserJson, MangaPacket } from './types';
import { checkCache } from './cache';
// import fetchMangaDex from './SourceUpdates/MangaDex';
import fetchMangaFox from './SourceUpdates/MangaFox';
import fetchMangaLife from './SourceUpdates/MangaLife';
import fetchMangaKakalot from './SourceUpdates/MangaKakalot';
import fetchMangaNelo from './SourceUpdates/MangaNelo';
import sendIfttt from './NotificationServices/ifttt';
// import sendSpontit from './NotificationServices/spontit';
import { fetchUserJson, removeExtraChars } from './utils';

if (require.main === module) {
    main();
}

async function main() {
    // Set Axios defaults
    axios.defaults.headers.common['User-Agent'] =
        'Mozilla/5.0 (X11; Linux x86_64; rv:73.0) Gecko/20100101 Firefox/73.0';
    axios.defaults.withCredentials = true;

    console.log('Starting update service...');

    // Initial dispatch update call
    await dispatchUpdateEvent();

    // Dispatch updates on an interval every 30 minutes.
    setInterval(async () => {
        await dispatchUpdateEvent();
    }, 1.8e6);

    console.log('Update interval successfully set');
}

async function dispatchUpdateEvent() {
    const users = await fs.readdir('users').catch(() => {
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

    // Fetches updates from MangaNelo
    const mangaNelo = await fetchMangaNelo();
    updateArray = updateArray.concat(mangaNelo);

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
            const strippedName = removeExtraChars(i.Name);
            const result =
                userEntry.title === strippedName && userEntry.source === i.Source.toLowerCase();

            if (result) {
                userEntry.title = i.Name;
                userEntry.source = i.Source;
            }

            return result;
        });

        if (updateResult !== undefined) {
            // If there is a hit in the cache, bail.
            const cacheHit = checkCache(updateResult, userConfig.user);

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
        }
    });
}
