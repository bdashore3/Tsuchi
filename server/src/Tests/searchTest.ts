//  node ./server/dist/Tests/searchTest.js -o solo leveling
//  node ./server/dist/Tests/searchTest.js -t solo leveling

import searchMangaFox from '../SourceSearch/MangaFox';
import searchMangaLife from '../SourceSearch/MangaLife';
import searchMangaNato from '../SourceSearch/MangaNato';
import { fetchSearch } from '../SourceSearch';

if (require.main === module) {
    const args = process.argv;
    const argTitle = args.slice(3).join(' ').trim();
    if (args[2] == '-o') {
        searchResult(argTitle);
    } else if (args[2] == '-t') {
        testSearches(argTitle);
    } else {
        console.error('Incorrect arguments at 3rd position.');
    }
}

// -o
async function searchResult(query: string) {
    const res = await fetchSearch(query);
    console.log(res.length);
    console.log(res);
    console.log(res.length);
    return res;
}

// -t
async function testSearches(query: string): Promise<void> {
    if (query == '') {
        console.log([]);
        return;
    }

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

    console.log('### MANGAFOX');
    const mf = await searchMangaFox(query);
    if (mf.length < 1) {
        console.log('### No Manga for this search string was found in MangaNato');
    } else {
        console.log(`Found ${mf.length} manga matching the search string...`);
        for (const el of mf) {
            console.log(el);
        }
    }
    console.log();
}
