import axios from 'axios';
import cheerio from 'cheerio';
import { MangaPacket } from 'types/sourceEntries';

export async function fetchMangaFox(): Promise<Array<MangaPacket>> {
    const baseDomain = 'https://fanfox.net/releases/';

    const mangaFoxUpdates: Array<MangaPacket> = [];

    const html = await axios.get(baseDomain);
    const $ = cheerio.load(html.data, {
        xmlMode: false,
        decodeEntities: true
    });

    const latestMangas = $('ul.manga-list-4-list');

    for (const manga of $('.manga-list-4-list > li', latestMangas).toArray()) {
        const title: string = $('.manga-list-4-item-title', manga).text().trim();
        const subtitle: string = $('.manga-list-4-item-subtitle', manga).text().trim();

        const chapter = subtitle.split(' ').slice(0, 3).join(' ');
        const time_string = subtitle.split(' ').slice(3).join(' ');

        const mangapacket: MangaPacket = {
            Name: title,
            Chatper: chapter,
            TimeElapsed: calculateTime(time_string),
            Source: 'MangaFox'
        };
        mangaFoxUpdates.push(mangapacket);
    }

    return mangaFoxUpdates;
}

function calculateTime(time: string): number {
    const arr = time.split(' ');
    const int: number = +arr[0];
    let timeElapsed = 0;

    if (arr[1] == 'hour') {
        timeElapsed = int * 60;
    } else if (arr[1] == 'minutes') {
        timeElapsed = int;
    } else {
        timeElapsed = int * 1440;
    }
    return timeElapsed;
}
