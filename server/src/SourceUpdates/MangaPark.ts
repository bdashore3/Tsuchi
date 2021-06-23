import axios from 'axios';
import cheerio from 'cheerio';
import { MangaPacket } from '../types';
import { cloudFlareRequest } from '../utils';

// Top-level cookie string to store cloudflare cookies
let cookieString = '';

export default async function fetchMangaPark(): Promise<Array<MangaPacket>> {
    const mangaParkUpdates: Array<MangaPacket> = [];

    const baseDomain = 'https://v2.mangapark.net/';

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

            return mangaParkUpdates;
        }
    }

    const $ = cheerio.load(resp.data.solution.response, {
        xmlMode: false,
        decodeEntities: true
    });

    for (const item of $('.item', '.ls1').toArray()) {
        const title = $('.cover', item).attr('title') ?? '';
        const image = $('img', item).attr('src') ?? '';
        const chapter = $('.visited', item).first().text();
        const time_string = $('.new > i', item).first().text();

        const time = calculateTime(time_string);

        if (time > 60) {
            break;
        }

        const mangapacket: MangaPacket = {
            Name: title,
            Chapter: chapter,
            Image: image,
            Source: 'MangaPark'
        };

        mangaParkUpdates.push(mangapacket);
    }

    return mangaParkUpdates;
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
