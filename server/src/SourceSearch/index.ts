import { SearchPacket } from '../types';
import { removeExtraChars } from '../utils';

import searchMangaFox from './MangaFox';
import searchMangaLife from './MangaLife';
import searchMangaNato from './MangaNato';

export async function fetchSearch(searchString: string): Promise<Array<SearchPacket>> {
    // Empty array of searches from all sources
    let searchArray: Array<SearchPacket> = [];

    const query = removeExtraChars(searchString).trim();
    if (query == '') {
        return searchArray;
    }

    const promises: Array<Promise<Array<SearchPacket>>> = [];

    // Searches from all the sources
    promises.push(searchMangaLife(query));
    promises.push(searchMangaNato(query));
    promises.push(searchMangaFox(query));

    (await Promise.allSettled(promises))
        .filter((p) => p.status === 'fulfilled')
        .map((p) => {
            const individualResult = p as PromiseFulfilledResult<Array<SearchPacket>>;

            searchArray = searchArray.concat(individualResult.value);
        });

    return searchArray;
}
