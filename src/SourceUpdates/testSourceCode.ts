import fetchAnilist from '../Trackers/anilistParser';

if (require.main === module) {
    main();
}
// yarn stest
async function main(): Promise<void> {
    console.clear();
    // console.log(await fetchMangaKakalot());
    const mangaFox = await fetchAnilist('kingbri');
    console.log(mangaFox);
    console.log(mangaFox.length);
}
