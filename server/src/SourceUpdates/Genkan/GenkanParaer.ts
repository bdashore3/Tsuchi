import axios, { AxiosError } from 'axios';
import cheerio from 'cheerio';
import { MangaPacket } from '../../types';
import { calculateGenericTime } from '../../utils';

export default async function fetchFromGenkan(
    baseDomain: string,
    source: string
): Promise<Array<MangaPacket>> {
    const genkanUpdates: Array<MangaPacket> = [];

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
        return genkanUpdates;
    }
    console.log(html.data.solution.cookies);

    const cookies = html.data.solution.cookies;

    const $ = cheerio.load(html.data.solution.response, {
        xmlMode: false,
        decodeEntities: true
    });
    for (const item of $('.list-item', '.row').toArray()) {
        const title = $('.list-title', item).text().trim();
        const chapter = $('.badge', item).text().trim();
        // Recommended and Latest in same class block.
        if (chapter == '') {
            break;
        }

        const style = $('.media-content', item).attr('style') ?? '';
        const image = style.slice(style.indexOf('(') + 1, style.indexOf(')'));

        const time_string = $('.text-muted', item).text().trim();
        const time = calculateGenericTime(time_string);

        if (time > 60) {
            break;
        }

        const mangapacket: MangaPacket = {
            Name: title,
            Chapter: chapter,
            Image: image,
            Source: `${source}`
        };

        genkanUpdates.push(mangapacket);
    }

    return genkanUpdates;
}
