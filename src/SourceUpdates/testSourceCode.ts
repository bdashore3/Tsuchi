import { fetchMangaKakalot } from './MangaKakalot';
import { fetchMangaFox } from './MangaFox';

if (require.main === module) {
    main();
}
// yarn stest
async function main(): Promise<void> {
    console.clear();
    // console.log(await fetchMangaKakalot());
    const mangaFox = await fetchMangaFox();
    console.log(mangaFox);
}
