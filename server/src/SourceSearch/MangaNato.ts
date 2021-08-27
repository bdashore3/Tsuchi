import axios, { AxiosError } from 'axios';
import { SearchPacket } from '../types';
import cheerio from 'cheerio';
import { removeExtraChars } from '../utils';

export default async function searchMangaNato(searchString: string): Promise<Array<SearchPacket>> {
    const mangaLifeSearchResults: Array<SearchPacket> = [];

    const query = removeExtraChars(searchString).replace(/ /g, '_');

    const MNSearch = `https://manganato.com/advanced_search?s=all&sts=ongoing&orby=topview&page=1&keyw=${query}`;

    const html = await axios.get(MNSearch, { timeout: 30000 }).catch((err: AxiosError) => {
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

    const $ = cheerio.load(html.data, {
        xmlMode: false,
        decodeEntities: true
    });

    for (const manga of $('div.content-genres-item', 'div.panel-content-genres').toArray()) {
        const title = $('img', manga).first().attr('alt') ?? '';
        const link = $('a', manga).attr('href') ?? '';
        const image = $('img', manga).first().attr('src') ?? '';
        const views = $('span.genres-item-view', manga).text().replace(/,/g, '');

        const searchPacket: SearchPacket = {
            Name: removeExtraChars(title),
            Image: image,
            Link: link,
            Status: 'Ongoing',
            Source: 'MangaNato',
            Views: +views
        };

        mangaLifeSearchResults.push(searchPacket);
    }

    return mangaLifeSearchResults;
}
