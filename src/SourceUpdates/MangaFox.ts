import axios, { AxiosError } from 'axios';
import cheerio from 'cheerio';
import { MangaPacket } from 'types/sourceEntries';

export async function fetchMangaFox(): Promise<Array<MangaPacket>> {
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

    mangas.forEach((manga) => {
        const title: string = $('.manga-list-4-item-title', manga).text().trim();

        const subtitle = $('.manga-list-4-item-subtitle', manga).text().trim();
        const time_string = subtitle.split(' ').slice(3).join(' ');
        const time = calculateTime(time_string);

        const chapter_string = $('.manga-list-4-item-part', manga).text();
        const chapter = chapter_string.split(' ')[1];

        if (time > 60) {
            return;
        }

        const mangapacket: MangaPacket = {
            Name: title,
            Chapter: chapter,
            TimeElapsed: time,
            Source: 'MangaFox'
        };

        mangaFoxUpdates.push(mangapacket);
    });

    return mangaFoxUpdates;
}

function calculateTime(time: string): number {
    const arr = time.split(' ');
    const int: number = +arr[0];

    if (arr[1] == 'minutes') {
        return int;
    } else {
        return 100;
    }
}
