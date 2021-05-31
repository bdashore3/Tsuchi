import axios from 'axios';
import cheerio from 'cheerio';
import { MangaFoxEntry } from 'types/sourceEntries';

export async function fetchMangaFox(): Promise<Array<MangaFoxEntry>> {

    const baseDomain = 'https://fanfox.net/releases/';

    const mangaFoxUpdates: Array<MangaFoxEntry> = [];

    const html = await axios.get(baseDomain);
    const $ = cheerio.load(html.data, {
        xmlMode: false,
        decodeEntities: true
    });

    const latestMangas = $('ul.manga-list-4-list');

    for (const manga of $('.manga-list-4-list > li', latestMangas).toArray()) {

        const title: string = $('.manga-list-4-item-title', manga).text().trim();
        const subtitle: string = $('.manga-list-4-item-subtitle', manga).text().trim();

        var chapter = subtitle.split(' ').slice(0,3).join(' ');
        var time = subtitle.split(' ').slice(3).join(' ');

        const mangaJson: MangaFoxEntry = {
            SeriesName: title,
            Chatper: chapter,
            Release: time,
            TimeElapsed: calculateTime(time)
        }
        mangaFoxUpdates.push(mangaJson)
    }
    
    return mangaFoxUpdates;
}

function calculateTime(time: string): number {

    var arr = time.split(' ')
    var int: number = +arr[0];
    var timeElapsed = 0;

    if (arr[1] == 'hour') {
        timeElapsed = int * 60;
    } else if (arr[1] == 'minutes') {
        timeElapsed = int;
    }
    return timeElapsed
}