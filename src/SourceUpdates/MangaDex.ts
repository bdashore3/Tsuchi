import axios, { AxiosError } from 'axios';
import { MangaPacket } from 'types/sourceEntries';

export async function fetchMangaDex(): Promise<Array<MangaPacket>> {
    const baseDomain = 'https://api.mangadex.org/';
    const limit = '20';
    const latest = baseDomain + 'manga?limit=' + limit;

    const MangaDexUpdates: Array<MangaPacket> = [];

    const AxiosInstance = axios.create();

    const response = await AxiosInstance.get(latest, { timeout: 30000 }).catch(
        (err: AxiosError) => {
            // Handle errors
            switch (err.code) {
                case 'ECONNABORTED':
                    console.log('Error: Mangadex: forcibly timed out');
                    break;
                case 'ETIMEDOUT':
                    console.log('Error: Mangadex: timed out');
                    break;
                default:
                    console.log(err);
            }
        }
    );

    if (!response) {
        return MangaDexUpdates;
    }

    const json = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;

    for (const manga of json.results) {
        const title = manga.data.attributes.title.en;
        const chapter = manga.data.attributes.lastChapter;
        const release = manga.data.attributes.updatedAt;

        const mangapacket: MangaPacket = {
            Name: title,
            Chapter: chapter,
            TimeElapsed: convertTime(release),
            Source: 'MangaDex'
        };
        MangaDexUpdates.push(mangapacket);
    }
    return MangaDexUpdates;
}

function convertTime(inputDate: string): number {
    const currentDate = new Date();
    const stampedDate = Date.parse(inputDate);
    const minutes = (currentDate.getTime() - stampedDate) / 60000;
    return Math.round(minutes);
}
