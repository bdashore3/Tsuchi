import axios from 'axios';
import cheerio from 'cheerio';
import { MangaPacket } from '../types';
import { calculateGenericTime, cloudFlareRequest } from '../utils';

let cookieString = '';

// Disabled due to error 1020 reports
export default async function fetchBaTo(): Promise<Array<MangaPacket>> {
    const baToUpdates: Array<MangaPacket> = [];

    const baseDomain = 'https://bato.to/';

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

            return baToUpdates;
        }
    }

    const $ = cheerio.load(resp.data.solution.response, {
        xmlMode: false,
        decodeEntities: true
    });

    for (const item of $('.item', '.mt-0').toArray()) {
        const title = $('.item-title', item).text().trim();
        const image = $('.item-cover > img', item).attr('src') ?? '';
        const chapter = $('.visited', item).text().trim();
        const time_string = $('.item-volch > div', item).text().trim();

        const time = calculateGenericTime(time_string);
        console.log(time);

        // if (time > 60) {
        //     break;
        // }

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
