import { MangaPacket } from '../types';
import fetchMangaFox from './MangaFox';
import fetchMangaKakalot from './MangaKakalot';
import fetchMangaLife from './MangaLife';
import fetchMangaNelo from './MangaNelo';

export async function fetchUpdates(): Promise<Array<MangaPacket>> {
    // Empty array of updates from all sources
    let updateArray: Array<MangaPacket> = [];

    const promises: Array<Promise<Array<MangaPacket>>> = [];

    // Fetches updates from Manga4Life
    promises.push(fetchMangaLife());
    promises.push(fetchMangaFox());
    promises.push(fetchMangaKakalot());
    promises.push(fetchMangaNelo());

    (await Promise.allSettled(promises))
        .filter((p) => p.status === 'fulfilled')
        .map((p) => {
            const individualResult = p as PromiseFulfilledResult<Array<MangaPacket>>;

            updateArray = updateArray.concat(individualResult.value);
        });

    return updateArray;
}
