import fetchAnilist from '../Trackers/anilist';

if (require.main === module) {
    main();
}
// yarn stest
async function main(): Promise<void> {
    console.clear();
    // console.log(await fetchMangaKakalot());
    const anilist = await fetchAnilist('kingbri');
    console.log(anilist);
    console.log(anilist.length);
}
