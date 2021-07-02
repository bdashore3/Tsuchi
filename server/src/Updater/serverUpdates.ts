import { checkCache } from '../cache';
import { PgPool } from '../Config/PgPool';
import sendIfttt from '../NotificationServices/ifttt';
import { fetchUpdates } from '../SourceUpdates';
import { GenericService, MangaPacket } from '../types';
import { removeExtraChars } from '../utils';

export async function dispatchServerUpdate(): Promise<void> {
    const users = await PgPool.any('SELECT username FROM users');

    if (users.length === 0) {
        console.log('No users in the DB!');

        return;
    }

    const updates = await fetchUpdates();

    const promises: Array<Promise<void>> = [];
    for (const user of users) {
        promises.push(dispatchToUser(user.username, updates));
    }

    await Promise.allSettled(promises);
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

    for (const service of services) {
        switch (service.service_name) {
            case 'ifttt':
                promises.push(sendIfttt(service.api_name!, service.api_secret!, payload));
                break;
        }
    }

    await Promise.allSettled(promises);
}
