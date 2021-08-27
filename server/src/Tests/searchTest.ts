//  node ./server/dist/Tests/searchTest.js
//  node ./server/dist/Tests/searchTest.js title in args

// Example
//  node ./server/dist/Tests/searchTest.js A rare marr
//  node ./server/dist/Tests/searchTest.js Tensei Shi
//  node ./server/dist/Tests/searchTest.js Baka

import searchMangaLife from '../SourceSearch/MangaLife';
import searchMangaNato from '../SourceSearch/MangaNato';

if (require.main === module) {
    const args = process.argv;
    const argTitle = args.slice(2).join(' ');
    if (argTitle == '') {
        testSearches('that time i got');
    } else {
        testSearches(argTitle);
    }
}

async function testSearches(query: string): Promise<void> {
    console.log(`Using "${query}" as a search string...\n`);

    console.log('### MANGALIFE');
    const ml = await searchMangaLife(query);
    if (ml.length < 1) {
        console.log('### No Manga for this search string was found in MangaLife');
    } else {
        console.log(`Found ${ml.length} manga matching the search string...`);
        for (const el of ml) {
            console.log(el);
        }
    }
    console.log();

    console.log('### MANGANATO');
    const mn = await searchMangaNato(query);
    if (mn.length < 1) {
        console.log('### No Manga for this search string was found in MangaNato');
    } else {
        console.log(`Found ${mn.length} manga matching the search string...`);
        for (const el of mn) {
            console.log(el);
        }
    }
    console.log();
}
