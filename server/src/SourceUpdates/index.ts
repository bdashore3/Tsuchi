import { MangaPacket } from '../types';
import fetchMangaFox from './MangaFox';
import fetchMangaKakalot from './MangaKakalot';
import fetchMangaLife from './MangaLife';
import fetchMangaNelo from './MangaNelo';

export async function fetchUpdates(): Promise<Array<MangaPacket>> {
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
