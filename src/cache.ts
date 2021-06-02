import { MangaPacket } from 'types/sourceEntries';

const userCache: Map<MangaPacket, number> = new Map();

function addToCache(input: MangaPacket) {
    const now = Date.now();

    userCache.set(input, now + 3600000);
}

export function updateCache(input: MangaPacket): void {
    const testValue = userCache.get(input);

    if (testValue !== undefined) {
        const now = Date.now();

        if (testValue < now) {
            userCache.delete(input);
        }
    }

    addToCache(input);
}

export function checkCache(input: MangaPacket): boolean {
    return userCache.has(input);
}

export function flushCache(): void {
    console.log('Flushing cache!');

    const now = Date.now();

    userCache.forEach((timestamp, manga) => {
        if (timestamp < now) {
            userCache.delete(manga);
        }
    });
}
