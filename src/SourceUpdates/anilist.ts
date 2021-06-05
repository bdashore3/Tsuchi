import axios, { AxiosError } from 'axios';
import cheerio from 'cheerio';

export default async function anilist(): Promise<void> {
    const baseDomain = 'https://anilist.co/user/tonix/mangalist';
    const html = await axios.get(baseDomain);

    const $ = cheerio.load(html.data, {
        xmlMode: false,
        decodeEntities: true
    });
    // console.log($.html());

    for (const lists of $('.list-wrap', '.lists.no-auth').toArray()) {
        // console.log($('.list-entries', lists).text());
        const list = $('.list-entries', lists);

        console.log($('a', list).text());
    }
}
