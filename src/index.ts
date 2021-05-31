import { fetchMangaLife } from './SourceUpdates/MangaLife';

if (require.main === module) {
    main();
}

// Future home for web server

async function main() {
    // Fetches update json from Manga4Life
    console.log(await fetchMangaLife());
}
