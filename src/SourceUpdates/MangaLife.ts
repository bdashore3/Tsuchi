import axios, { AxiosError } from 'axios';
import { MangaLifeEntry, MangaPacket } from 'types/sourceEntries';

export default async function fetchMangaLife(): Promise<Array<MangaPacket>> {
    const mangaLifeUpdates: Array<MangaPacket> = [];

    const baseDomain = 'https://manga4life.com/';

    const html = await axios.get(baseDomain, { timeout: 30000 }).catch((err: AxiosError) => {
        switch (err.code) {
            case 'ECONNABORTED':
                console.log('Error: Mangalife: forcibly timed out');
                break;
            case 'ETIMEDOUT':
                console.log('Error: Mangalife: timed out');
                break;
            default:
                console.log(err);
        }
    });

    if (!html) {
        return mangaLifeUpdates;
    }

    const rawUpdates: Array<MangaLifeEntry> = JSON.parse(
        html.data.match(/vm.LatestJSON = (.*);/)?.[1]
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
            Source: 'mangalife',
            TimeElapsed: timeElapsed
        };

        mangaLifeUpdates.push(mangaPacket);
    });

    return mangaLifeUpdates;
}

function convertTime(inputDate: string): number {
    const time = Date.parse(inputDate) - 3600000;
    const minutes = (Date.now() - time) / 60000;

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
