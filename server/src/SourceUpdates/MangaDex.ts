import axios, { AxiosError } from 'axios';
import { MangaDexEntry, MangaDexRelationship, MangaPacket } from '../types';

export default async function fetchMangaDex(): Promise<Array<MangaPacket>> {
    const mangaDexUpdates: Array<MangaPacket> = [];

    const latestPage =
        'https://api.mangadex.org/chapter?limit=20&order[updatedAt]=desc&translatedLanguage[]=en&includes[]=manga';

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
        return mangaDexUpdates;
    }

    const json: MangaDexEntry =
        typeof response.data === 'string' ? JSON.parse(response.data) : response.data;

    for (const result of json.results) {
        const id = result.data.id;
        const manga = result.relationships.find(
            (relationship: MangaDexRelationship) => relationship.type === 'manga'
        );

        // If we can't get a title, break out because the notification will be ambiguous
        if (manga === undefined) {
            break;
        }

        const title = manga.attributes.title.en;

        const chapter = result.data.attributes.chapter;
        const time = convertTime(result.data.attributes.updatedAt);

        if (time > 90) {
            break;
        }

        /*
        const coverId = manga.relationships.find(
            (relationship: MangaDexRelationship) => relationship.type === 'cover_art'
        );

        const image = await getCoverImage(coverId.id, id);
        */

        const mangapacket: MangaPacket = {
            Name: title,
            Chapter: chapter,
            Image: undefined,
            Source: 'MangaDex'
        };

        mangaDexUpdates.push(mangapacket);
    }

    return mangaDexUpdates;
}

function convertTime(inputDate: string): number {
    const time = Date.parse(inputDate);
    return (Date.now() - time) / 60000;
}

async function getCoverImage(coverId: string, id: string): Promise<string> {
    const COVER_BASE_URL = 'https://uploads.mangadex.org/covers';
    const coverItem = `https://api.mangadex.org/cover/${coverId}`;

    const response = await axios.get(coverItem).catch(() => {
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
