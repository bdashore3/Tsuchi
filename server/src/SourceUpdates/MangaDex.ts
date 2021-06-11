import axios, { AxiosError } from 'axios';
import { MangaPacket } from '../types';

export default async function fetchMangaDex(): Promise<Array<MangaPacket>> {
    const MangaDexUpdates: Array<MangaPacket> = [];

    const baseDomain = 'https://api.mangadex.org/';
    const limit = '20';
    const latest = baseDomain + 'manga?limit=' + limit;
    const response = await axios.get(latest, { timeout: 30000 }).catch((err: AxiosError) => {
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
    });

    if (!response) {
        return MangaDexUpdates;
    }

    const json = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;

    for (const manga of json.results) {
        const title = manga.data.attributes.title.en;
        const chapter = manga.data.attributes.lastChapter;
        const time = convertTime(manga.data.attributes.upadtedAt);

        if (time > 90) {
            break;
        }

        const mangapacket: MangaPacket = {
            Name: title,
            Chapter: chapter,
            Source: 'mangadex'
        };
        MangaDexUpdates.push(mangapacket);
    }
    return MangaDexUpdates;
}

function convertTime(inputDate: string): number {
    const time = Date.parse(inputDate);
    return (Date.now() - time) / 60000;
}