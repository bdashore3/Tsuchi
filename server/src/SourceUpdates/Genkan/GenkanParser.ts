import axios from 'axios';
import cheerio from 'cheerio';
import { MangaPacket } from '../../types';
import { calculateGenericTime, cloudFlareRequest } from '../../utils';

let cookieString = '';

export default async function fetchFromGenkan(
    baseDomain: string,
    source: string
): Promise<Array<MangaPacket>> {
    const genkanUpdates: Array<MangaPacket> = [];

    let resp;
    try {
        resp = await axios.get(baseDomain, {
            headers: {
                Cookie: cookieString
            }
        });
    } catch (err) {
        if (err.response.status == 403 || err.response.status == 503) {
            const cfResp = await cloudFlareRequest(baseDomain);

            cookieString = cfResp.cookies;
            resp = cfResp.response;
        } else {
            console.log(err);

            return genkanUpdates;
        }
    }

    const $ = cheerio.load(resp.data.solution.response, {
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
