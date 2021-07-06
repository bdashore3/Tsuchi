import axios, { AxiosError } from 'axios';
import cheerio from 'cheerio';
import { MangaPacket } from '../types';
import { calculateGenericTime } from '../utils';

export default async function fetchMangaFox(): Promise<Array<MangaPacket>> {
    const mangaFoxUpdates: Array<MangaPacket> = [];

    const baseDomain = 'https://fanfox.net/';
    const latest = baseDomain + 'releases/';
    const html = await axios.get(latest, { timeout: 30000 }).catch((err: AxiosError) => {
        switch (err.code) {
            case 'ECONNABORTED':
                console.log('Error: Mangafox: forcibly timed out');
                break;
            case 'ETIMEDOUT':
                console.log('Error: Mangafox: timed out');
                break;
            default:
                console.log(err);
        }
    });

    if (!html) {
        return mangaFoxUpdates;
    }

    const $ = cheerio.load(html.data, {
        xmlMode: false,
        decodeEntities: true
    });

    const latestMangas = $('ul.manga-list-4-list');

    const mangas = $('.manga-list-4-list > li', latestMangas).toArray();

    for (const manga of mangas) {
        const title: string = $('.manga-list-4-item-title', manga).text().trim();
        const image = $('img', manga).first().attr('src') ?? '';
        const subtitle = $('.manga-list-4-item-subtitle', manga).text().trim();
        const time_string = subtitle.split(' ').slice(3).join(' ');
        const time = calculateGenericTime(time_string);

        const chapter_string = $('.manga-list-4-item-part', manga).text();
        const chapter = chapter_string.split(' ')[1];

        if (time > 60) {
            break;
        }

        const mangapacket: MangaPacket = {
            Name: title,
            Chapter: chapter,
            Image: image,
            Source: 'MangaFox'
        };

        mangaFoxUpdates.push(mangapacket);
    }

    return mangaFoxUpdates;
}
