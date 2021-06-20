import axios, { AxiosError } from 'axios';
import cheerio from 'cheerio';
import { MangaPacket } from '../types';

export default async function fetchBaTo(): Promise<Array<MangaPacket>> {
    const baToUpdates: Array<MangaPacket> = [];

    const baseDomain = 'https://bato.to/';

    const body = {
        cmd: 'request.get',
        url: `${baseDomain}`,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleW...',
        maxTimeout: 60000
    };

    // Takes anywhere from 6-25 seconds to return data
    const html = await axios
        .post('http://0.0.0.0:8191/v1', JSON.stringify(body))
        .catch((err: AxiosError) => {
            console.log(err);
        });

    if (!html) {
        return baToUpdates;
    }

    const $ = cheerio.load(html.data.solution.response, {
        xmlMode: false,
        decodeEntities: true
    });

    for (const item of $('.item', '.mt-0').toArray()) {
        const title = $('.item-title', item).text().trim();
        const image = $('.item-cover > img', item).attr('src') ?? '';
        const chapter = $('.visited', item).text().trim();
        const time_string = $('.item-volch > div', item).text().trim();

        const time = calculateTime(time_string);

        if (time > 60) {
            break;
        }

        const mangapacket: MangaPacket = {
            Name: title,
            Chapter: chapter,
            Image: image,
            Source: 'BaTo'
        };

        baToUpdates.push(mangapacket);
    }

    return baToUpdates;
}

function calculateTime(time: string): number {
    const arr = time.split(' ');
    const int: number = +arr[0];

    if (arr[1] == 'mins') {
        return int;
    } else if (arr[1] == 'secs') {
        // If seconds in the latest update, it would return as 1 minute old
        return 1;
    } else {
        return 100;
    }
}
