import axios from 'axios';
import cheerio from 'cheerio';
import { MangaLifeEntry, MangaPacket } from 'types/sourceEntries';

export async function fetchMangaLife(): Promise<Array<MangaPacket>> {
    const mangaLifeUpdates: Array<MangaPacket> = [];

    const baseDomain = 'https://manga4life.com/';

    const html = await axios.get(baseDomain);
    const $ = cheerio.load(html.data, {
        xmlMode: false,
        decodeEntities: true
    });

    const child = $('script').get()[16].children[0];

    /* eslint-disable @typescript-eslint/no-explicit-any */
    const data: string = (<any>child).data;

    const rawUpdates: Array<MangaLifeEntry> = JSON.parse(
        data
            .substring(
                data.lastIndexOf('vm.LatestJSON = [{') + 16,
                data.lastIndexOf('vm.NewSeriesJSON = [{')
            )
            .slice(0, -5)
    );
    rawUpdates.splice(20, rawUpdates.length - 1);

    rawUpdates.forEach((element) => {
        const timeElapsed = convertTime(element.Date);

        if (timeElapsed > 400) {
            return;
        }

        const mangaPacket: MangaPacket = {
            Chapter: parseChapter(element.Chapter),
            Name: element.SeriesName,
            Source: 'MangaLife',
            TimeElapsed: timeElapsed
        };

        mangaLifeUpdates.push(mangaPacket);
    });

    return mangaLifeUpdates;
}

function convertTime(inputDate: string): number {
    const currentDate = new Date();
    const stampedDate = Date.parse(inputDate);
    const minutes = currentDate.getTime() / 60000 - stampedDate / 60000;

    return minutes;
}

function parseChapter(inputChapter: string): string {
    const numbers = inputChapter.split('');
    numbers.shift();

    if (parseInt(numbers[numbers.length - 1]) > 0) {
        numbers[numbers.length - 1] = `.${numbers[numbers.length - 1]}`;
    }

    return numbers.join('').replace(/0/g, '');
}
