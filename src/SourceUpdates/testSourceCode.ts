import fetchMangaKakalot from './MangaKakalot';
import fetchMangaFox from './MangaFox';
import fetchDir from './MangaNeloDirectory';
import { time } from 'console';

if (require.main === module) {
    main();
}

// yarn stest
async function main(): Promise<void> {
    console.clear();
    // console.log(await fetchMangaKakalot());
    let i = 830;
    while (i < 831) {
        console.log(i);
        const mangaFox = await fetchDir(i + '');
        console.log(mangaFox);
        console.log(mangaFox.length);
        i++;
    }
}
