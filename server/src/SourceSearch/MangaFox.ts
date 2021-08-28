import axios, { AxiosError } from 'axios';
import { SearchPacket } from '../types';
import cheerio from 'cheerio';
import { removeExtraChars } from '../utils';

export default async function searchMangaFox(searchString: string): Promise<Array<SearchPacket>> {
    const mangaLifeSearchResults: Array<SearchPacket> = [];

    const query = removeExtraChars(searchString).replace(/ /g, '+');

    const MNSearch = `https://fanfox.net/search?title=${query}`;

    const html = await axios.get(MNSearch, { timeout: 30000 }).catch((err: AxiosError) => {
        switch (err.code) {
            case 'ECONNABORTED':
                console.log('Error: MangaNato: forcibly timed out');
                break;
            case 'ETIMEDOUT':
                console.log('Error: MangaNato: timed out');
                break;
            default:
                console.log(err);
        }
    });

    if (!html) {
        return mangaLifeSearchResults;
    }

    const $ = cheerio.load(html.data, {
        xmlMode: false,
        decodeEntities: true
    });

    for (const manga of $('li', 'ul.manga-list-4-list.line').toArray()) {
        const title = $('img', manga).first().attr('alt') ?? '';
        const link = 'https://fanfox.net/' + $('a', manga).attr('href') ?? '';
        const image =
            $('img', manga).first().attr('src') ??
            'https://static.mangahere.cc/v20210106/mangahere/images/nopicture.jpg';
        const author = $('p:nth-child(4) > a', manga).text() ?? '...';
        const latest = $('p:nth-child(5) > a', manga).text() ?? '...';
        const desc = $('p:nth-child(6)', manga).html() ?? '...';

        const searchPacket: SearchPacket = {
            Name: removeExtraChars(title),
            Image: image,
            Link: link,
            Author: author,
            LatestChapter: latest,
            Description: desc,
            Views: 0,
            Status: 'Ongoing',
            Source: 'MangaNato'
        };

        mangaLifeSearchResults.push(searchPacket);
    }

    return mangaLifeSearchResults;
}
