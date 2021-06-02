


import axios from 'axios';
import cheerio from 'cheerio';
import { MangaPacket } from 'types/sourceEntries';

export async function fetchMangaNelo(): Promise<Array<MangaPacket>> {
    const baseDomain = 'https://manganato.com/';
    const latest = baseDomain + 'releases/'

    const mangaNeloUpdates: Array<MangaPacket> = [];

    const html = await axios.get(latest);
    const $ = cheerio.load(html.data, {
        xmlMode: false,
        decodeEntities: true
    });
    console.log($.html())
    for (const item of $('.content-homepage-item', '.panel-content-homepage').toArray()) {
    }

    return mangaNeloUpdates;
}