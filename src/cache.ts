import { MangaPacket } from 'types/sourceEntries';

const userCache: Map<string, number> = new Map();

// Adds a new entry to the cache with an expiry time.
function addToCache(input: string) {
    const now = Date.now();

    userCache.set(input, now + 3600000);
}

/*
 * Checks if there's an entry in the cache.
 * If there is an entry, check if the timestamp is old and delete it
 * to free up cache space.
 */
export function checkCache(input: MangaPacket): boolean {
    const inputString = JSON.stringify(input);
    const testValue = userCache.get(inputString);

    if (testValue === undefined) {
        addToCache(inputString);

        return false;
    } else {
        const now = Date.now();

        if (testValue < now) {
            userCache.delete(inputString);
        }

        return true;
    }
}

// Flushes out any cache leftovers.
export function flushCache(): void {
    const now = Date.now();

    userCache.forEach((timestamp, manga) => {
        if (timestamp < now) {
            userCache.delete(manga);
        }
    });
}
