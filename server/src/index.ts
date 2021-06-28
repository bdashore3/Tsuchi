import { MangaPacket, GenericService } from './types';
import { checkCache } from './cache';
// import fetchMangaDex from './SourceUpdates/MangaDex';
import fetchMangaFox from './SourceUpdates/MangaFox';
import fetchMangaLife from './SourceUpdates/MangaLife';
import fetchMangaKakalot from './SourceUpdates/MangaKakalot';
import fetchMangaNelo from './SourceUpdates/MangaNelo';
import sendIfttt from './NotificationServices/ifttt';
// import sendSpontit from './NotificationServices/spontit';
import { removeExtraChars } from './utils';
import { handleCredentials } from './Config/credentialsHelper';
import { configurePool, PgPool } from './Config/PgPool';

if (require.main === module) {
    main();
}

async function main() {
    const args = process.argv.slice(2);

    const creds = await handleCredentials(args[0]);

    // All internal service configuration goes here
    configurePool(creds.DBUrl);

    // Clear sensitive credentials for security
    creds.DBUrl = undefined;

    // Initial dispatch update call
    await dispatchUpdateEvent();

    // Dispatch updates on an interval every 30 minutes.
    setInterval(async () => {
        await dispatchUpdateEvent();
    }, 1.8e6);

    console.log('Update interval successfully set');
}

// TODO: Split into an update handler for server/single-user
async function dispatchUpdateEvent() {
    const users = await PgPool.any('SELECT username FROM users');

    if (users.length === 0) {
        console.log('No users in the DB!');

        return;
    }

    const updates = await fetchUpdates();

    const promises: Array<Promise<void>> = [];
    users.forEach((user) => {
        promises.push(dispatchToUser(user.username, updates));
    });

    await Promise.allSettled(promises);
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
async function dispatchToUser(username: string, updates: Array<MangaPacket>) {
    const mangas = await PgPool.any('SELECT title, source FROM mangas WHERE username = $1', [
        username
    ]);

    let userServices: Array<GenericService> = [];
    let success = 0;
    const total = mangas.length;

    console.log();
    console.log(`Evaluating mangas for ${username}`);

    for (const manga of mangas) {
        const updateResult = updates.find((i) => {
            const strippedName = removeExtraChars(i.Name);
            const result = manga.title === strippedName && manga.source === i.Source.toLowerCase();

            if (result) {
                manga.title = i.Name;
                manga.source = i.Source;
            }

            return result;
        });

        if (updateResult !== undefined) {
            // If there is a hit in the cache, bail.
            const cacheHit = checkCache(updateResult, username);

            if (!cacheHit) {
                if (userServices.length === 0) {
                    userServices = await PgPool.any(
                        'SELECT service_name, api_name, api_secret FROM services WHERE username = $1',
                        [username]
                    );
                }

                success++;
                console.log(
                    `Sending notification for ${updateResult.Name} from ${updateResult.Source}`
                );

                await handleServices(userServices, updateResult);
            }
        }
    }

    console.log(`${success} updates from a total of ${total} manga(s)`);
    console.log();
}

// Handles dispatch to notification services.
/* eslint-disable @typescript-eslint/no-non-null-assertion */
async function handleServices(services: Array<GenericService>, payload: MangaPacket) {
    const promises: Array<Promise<void>> = [];

    services.forEach((service) => {
        switch (service.service_name) {
            case 'ifttt':
                promises.push(sendIfttt(service.api_name!, service.api_secret!, payload));
                break;
        }
    });

    await Promise.allSettled(promises);
}
