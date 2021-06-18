import { MangaPacket } from './types';
import NodeCache from 'node-cache';

const userCache: NodeCache = new NodeCache({
    stdTTL: 7200,
    deleteOnExpire: true
});

// Adds a new entry to the cache following the standard TTL.
function addToCache(cachedString: string, user: string) {
    userCache.set(cachedString, [user]);
}

// Updates an existing cache entry with a new user
function updateCache(cachedString: string, users: Array<string>) {
    userCache.set(cachedString, users);
}

/*
 * Checks if there's an entry in the cache.
 *
 * If there is a user array, check if the provided user exists in the array.
 * If the user array exists, but there's no user, update the cache with the new user.
 * If the user array doesn't exist, create a new cache entry for this manga packet
 */
export function checkCache(packet: MangaPacket, user: string): boolean {
    // Create a cached packet which removes unnecessary data and stringify it
    const cachedPacket = Object.assign({}, packet);
    delete cachedPacket.Image;

    const inputString = JSON.stringify(cachedPacket);

    const lowercaseUser = user.toLowerCase();
    const userArray: Array<string> | undefined = userCache.get(inputString);

    if (userArray === undefined) {
        addToCache(inputString, lowercaseUser);

        return false;
    } else if (userArray.includes(lowercaseUser)) {
        return true;
    } else {
        userArray.push(lowercaseUser);
        updateCache(inputString, userArray);

        return false;
    }
}
