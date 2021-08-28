import axios, { AxiosError } from 'axios';
import { SearchMangaLifeEntry, SearchPacket } from '../types';
import { removeExtraChars } from '../utils';

export default async function searchMangaLife(searchString: string): Promise<Array<SearchPacket>> {
    const mangaLifeSearchResults: Array<SearchPacket> = [];

    const query = removeExtraChars(searchString).trim();

    const MLSearch = 'https://manga4life.com/search/';

    const html = await axios.get(MLSearch, { timeout: 30000 }).catch((err: AxiosError) => {
        switch (err.code) {
            case 'ECONNABORTED':
                console.log('Error: Mangalife: forcibly timed out');
                break;
            case 'ETIMEDOUT':
                console.log('Error: Mangalife: timed out');
                break;
            default:
                console.log(err);
        }
    });

    if (!html) {
        return mangaLifeSearchResults;
    }

    const directory: Array<SearchMangaLifeEntry> = JSON.parse(
        html.data.match(/vm.Directory = (.*);/)?.[1]
    );
    for (const entry of directory) {
        const title = removeExtraChars(entry.s);
        const alt = removeExtraChars(entry.i);
        const views = +entry.v ?? 0;

        const searchPacket: SearchPacket = {
            Name: title,
            Image: `https://cover.nep.li/cover'/${entry.i}.jpg`,
            Link: `https://manga4life.com/manga/${entry.i}`,
            Author: entry.a.join(', '),
            LatestChapter: parseChapter(entry.l),
            Status: entry.ss,
            Source: 'MangaLife',
            Views: views
        };

        if (title.match(query) || (alt.match(query) && entry.ss == 'Ongoing')) {
            mangaLifeSearchResults.push(searchPacket);
        }
    }

    /*
    When views is optional ->
    =eslint-disable-next-line @typescript-eslint/ban-ts-comment
    =@ts-ignore: Object is possibly 'null'.
    */
    return mangaLifeSearchResults.sort((a, b) => 0 - (a.Views > b.Views ? 1 : -1));
}

function parseChapter(inputChapter: string): string {
    const numbers = inputChapter.split('');
    numbers.shift();

    if (parseInt(numbers[numbers.length - 1]) > 0) {
        numbers[numbers.length - 1] = `.${numbers[numbers.length - 1]}`;
    }

    return numbers.join('').replace(/^0+|0$/g, '');
}
