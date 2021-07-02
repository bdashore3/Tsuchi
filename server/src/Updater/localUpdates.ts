import { promises as fs } from 'fs';
import { checkCache } from '../cache';
import sendIfttt from '../NotificationServices/ifttt';
import { fetchUpdates } from '../SourceUpdates';
import { MangaPacket, UserJson } from '../types';
import { fetchUserJson, removeExtraChars } from '../utils';

export async function dispatchLocalUpdate(): Promise<void> {
    const users = await fs.readdir('users').catch(() => {
        console.log('No user JSONs in the users directory!');
    });

    if (!users) {
        return;
    }

    const updates = await fetchUpdates();

    const promises: Array<Promise<void>> = [];
    for (const userFile of users) {
        const userConfig = await fetchUserJson(userFile);

        promises.push(dispatchToUser(userConfig, updates));
    }

    await Promise.allSettled(promises);
}

/*
 * Iterates through each entry in the User configuration.
 *
 * If the user entry's title and source is found in the updates list, send a notification.
 */
async function dispatchToUser(userConfig: UserJson, updates: Array<MangaPacket>) {
    let success = 0;
    const total = userConfig.mangas.length;

    console.log();
    console.log(`Evaluating mangas for ${userConfig.user}`);

    for (const manga of userConfig.mangas) {
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
            const cacheHit = checkCache(updateResult, userConfig.user);

            if (!cacheHit) {
                success++;
                console.log(
                    `Sending notification for ${updateResult.Name} from ${updateResult.Source}`
                );

                await handleServices(userConfig, updateResult);
            }
        }
    }

    console.log(`${success} updates from a total of ${total} manga(s)`);
    console.log();
}

// Handles dispatch to notification services.
/* eslint-disable @typescript-eslint/no-non-null-assertion */
async function handleServices(userConfig: UserJson, payload: MangaPacket) {
    const promises: Array<Promise<void>> = [];

    for (const name of userConfig.services) {
        switch (name) {
            case 'ifttt':
                promises.push(
                    sendIfttt(userConfig.ifttt!.event_name, userConfig.ifttt!.key, payload)
                );
                break;
        }
    }

    await Promise.allSettled(promises);
}
