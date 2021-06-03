import { MangaPacket } from 'types/sourceEntries';

const userCache: Map<string, number> = new Map();

function addToCache(input: string) {
    const now = Date.now();

    userCache.set(input, now + 3600000);
}

export function updateCache(input: MangaPacket): void {
    const inputString = JSON.stringify(input);
    const testValue = userCache.get(inputString);

    if (testValue !== undefined) {
        const now = Date.now();

        if (testValue < now) {
            userCache.delete(inputString);
        }
    }

    addToCache(inputString);
}

export function checkCache(input: MangaPacket): boolean {
    const check = JSON.stringify(input);

    return userCache.has(check);
}

export function flushCache(): void {
    const now = Date.now();

    userCache.forEach((timestamp, manga) => {
        if (timestamp < now) {
            userCache.delete(manga);
        }
    });
}
