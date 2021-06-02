import { fetchMangaNelo } from './MangaNelo';
import { fetchMangaFox } from './MangaFox';

if (require.main === module) {
    main();
}
// yarn stest
async function main(): Promise<void> {
    console.clear();
    // console.log(await fetchMangaNelo());
    const mangaFox = await fetchMangaFox();
    console.log(mangaFox);
}
