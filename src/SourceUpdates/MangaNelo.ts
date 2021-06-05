import axios, { AxiosError } from 'axios';
import cheerio from 'cheerio';
import { MangaPacket } from 'types/sourceEntries';

export default async function fetchMangaNelo(): Promise<Array<MangaPacket>> {
    const mangaNeloUpdates: Array<MangaPacket> = [];

    const baseDomain = 'https://manganato.com/';
    const html = await axios.get(baseDomain, { timeout: 30000 }).catch((err: AxiosError) => {
        switch (err.code) {
            case 'ECONNABORTED':
                console.log('Error: Manganelo: forcibly timed out');
                break;
            case 'ETIMEDOUT':
                console.log('Error: Manganelo: timed out');
                break;
            default:
                console.log(err);
        }
    });

    if (!html) {
        return mangaNeloUpdates;
    }

    const $ = cheerio.load(html.data, {
        xmlMode: false,
        decodeEntities: true
    });

    for (const manga of $('div.content-homepage-item', 'div.panel-content-homepage').toArray()) {
        const title = $('img', manga).first().attr('alt') ?? '';
        const chapter = $('p.a-h.item-chapter > a.text-nowrap', manga).first().text().trim();

        const time_string = $('p.a-h.item-chapter > i', manga).first().text().trim();
        const time = calculateTime(time_string);

        if (time > 60) {
            break;
        }

        const mangapacket: MangaPacket = {
            Name: title,
            Chapter: chapter,
            Source: 'manganelo'
        };

        mangaNeloUpdates.push(mangapacket);
    }

    return mangaNeloUpdates;
}

function calculateTime(time: string): number {
    const arr = time.split(' ');
    const int: number = +arr[0];

    if (arr[1] == 'mins') {
        return int;
    } else {
        return 100;
    }
}
