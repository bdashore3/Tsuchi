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

    const json: MangaDexEntry = response.data;

    for (const result of json.results) {
        const time = convertTime(result.data.attributes.updatedAt);

        if (time > 90) {
            break;
        }

        const manga = result.relationships.find(
            (relationship: MangaDexRelationship) => relationship.type === 'manga'
        );

        // If we can't get a title, continue to the next title
        if (manga === undefined) {
            continue;
        }

        const title = manga.attributes.title.en;

        const chapter = result.data.attributes.chapter;

        const image = await getCoverImage(manga.id);

        const mangapacket: MangaPacket = {
            Name: title,
            Chapter: chapter,
            Image: image,
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

async function getCoverImage(mangaId: string): Promise<string> {
    const COVER_BASE_URL = 'https://uploads.mangadex.org/covers';
    const coverItem = `https://api.mangadex.org/cover?limit=1&manga[]=${mangaId}`;

    const response = await axios.get(coverItem).catch(() => {
        console.log(`Image Not Found for ${mangaId}`);
    });

    if (!response) {
        return 'https://mangadex.org/_nuxt/img/cover-placeholder.d12c3c5.jpg';
    }

    const json = response.data;

    const imageFileName = json.results[0].data.attributes.fileName;
    const image = `${COVER_BASE_URL}/${mangaId}/${imageFileName}`;

    return image;
}
