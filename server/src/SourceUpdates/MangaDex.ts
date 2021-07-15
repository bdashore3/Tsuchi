import axios, { AxiosError } from 'axios';
import { MangaPacket } from '../types';

export default async function fetchMangaDex(): Promise<Array<MangaPacket>> {
    const MangaDexUpdates: Array<MangaPacket> = [];

    const latestPage = `https://api.mangadex.org/manga?limit=20&order[updatedAt]=desc`;

    const response = await axios.get(latestPage, { timeout: 30000 }).catch((err: AxiosError) => {
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
        const id = manga.data.id;
        const title = manga.data.attributes.title.en;

        // manga.data.attributes.lastChapter is set to null for all in API
        const chapter = manga.data.attributes.lastChapter;
        const time = convertTime(manga.data.attributes.updatedAt);

        const coverId = manga.relationships.filter((x: any) => x.type == 'cover_art')[0];

        if (time > 90) {
            break;
        }

        const image = await getCoverImage(coverId.id, id);

        const mangapacket: MangaPacket = {
            Name: title,
            Chapter: 'New Chapter',
            Image: image,
            Source: 'MangaDex'
        };
        MangaDexUpdates.push(mangapacket);
    }
    return MangaDexUpdates;
}

function convertTime(inputDate: string): number {
    const time = Date.parse(inputDate);
    return (Date.now() - time) / 60000;
}

async function getCoverImage(coverId: string, id: string): Promise<string> {
    const COVER_BASE_URL = 'https://uploads.mangadex.org/covers';
    const coverItem = `https://api.mangadex.org/cover/${coverId}`;

    const response = await axios.get(coverItem).catch((err: AxiosError) => {
        console.log(`Image Not Found for ${id}`);
    });

    if (!response) {
        return 'https://mangadex.org/_nuxt/img/cover-placeholder.d12c3c5.jpg';
    }

    const json = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
    const imageFileName = json.data.attributes.fileName;

    const image = `${COVER_BASE_URL}/${id}/${imageFileName}`;
    return image;
}

// `https://api.mangadex.org/manga?limit=3&originalLanguage[]=en&order[updatedAt]=desc`;
