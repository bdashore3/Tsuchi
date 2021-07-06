import axios, { AxiosError } from 'axios';
import cheerio from 'cheerio';
import { MangaPacket } from '../types';
import { calculateGenericTime } from '../utils';

export default async function fetchMangaKakalot(): Promise<Array<MangaPacket>> {
    const mangaNeloUpdates: Array<MangaPacket> = [];

    const baseDomain = 'https://mangakakalot.com/';
    const html = await axios.get(baseDomain, { timeout: 30000 }).catch((err: AxiosError) => {
        switch (err.code) {
            case 'ECONNABORTED':
                console.log('Error: Manganelo: forcibly timed out');
                break;
            case 'ETIMEDOUT':
                console.log('Error: Manganelo: timed out');
                break;
            default:
                console.log(err);
        }
    });

    if (!html) {
        return mangaNeloUpdates;
    }

    const $ = cheerio.load(html.data, {
        xmlMode: false,
        decodeEntities: true
    });

    for (const item of $('.itemupdate.first', '.doreamon').toArray()) {
        const title = $('h3', item).text();
        const image = $('img', item).attr('src') ?? '';
        const chapter = $('.sts_1', item).first().text();
        const update = $('i', item).first().text();

        const time = calculateGenericTime(update);
        if (time > 60) {
            break;
        }

        const mangapacket: MangaPacket = {
            Name: title,
            Chapter: chapter,
            Image: image,
            Source: 'MangaKakalot'
        };

        mangaNeloUpdates.push(mangapacket);
    }

    return mangaNeloUpdates;
}
