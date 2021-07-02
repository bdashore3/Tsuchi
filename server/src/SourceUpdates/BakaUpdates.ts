import axios from 'axios';
import cheerio from 'cheerio';
import Parser from 'rss-parser';
import { BakaUpdatesDetails, BakaUpdatesData, MangaPacket } from '../types';
import { calculateGenericTime } from '../utils';

export default async function fetchBakaUpdates(): Promise<Array<MangaPacket>> {
    const bakaUpdates: Array<MangaPacket> = [];

    const baseDomain = 'https://www.mangaupdates.com/rss.php';

    const parser: Parser<BakaUpdatesData, BakaUpdatesDetails> = new Parser();

    const feed: BakaUpdatesData = await parser.parseURL(`${baseDomain}`);

    for (const manga of feed.items) {
        if (manga.link == undefined) {
            continue;
        }
        const info = manga.title.split(']', 2);

        const source = info[0].substring(1);
        const chapArr = info[1].split(' ');
        const chapter = chapArr[chapArr.length - 2] + chapArr[chapArr.length - 1];

        const path = manga.link;
        const detailsPage = await axios.get(path);
        const $ = cheerio.load(detailsPage.data, {
            xmlMode: false,
            decodeEntities: true
        });

        const title = $('.releasestitle').text();
        const image = $('.sContent > center > img').attr('src') ?? 'None';

        const colOne = $('.col-6').first();
        const mangas = $('.sContent', colOne).toArray();
        const timeString = $('span', mangas[5]).first().text();

        const time = calculateGenericTime(timeString);

        if (time > 60) {
            break;
        }

        const mangapacket: MangaPacket = {
            Name: title,
            Chapter: chapter,
            Image: image,
            Source: `BakaUpdates\n${source}`
        };
        bakaUpdates.push(mangapacket);
    }

    return bakaUpdates;
}
