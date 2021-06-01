import axios from 'axios';
import { MangaPacket } from 'types/sourceEntries';

export async function fetchMangaDex(): Promise<Array<MangaPacket>> {

    const baseDomain = 'https://api.mangadex.org/';
    const limit: string = '20';
    const latest = baseDomain + 'manga?limit=' + limit

    const MangaDexUpdates: Array<MangaPacket> = [];

    const AxiosInstance = axios.create();

    await AxiosInstance.get(latest)
    .then(
        response => {
            const json = typeof response.data === "string" ? JSON.parse(response.data) : response.data
            for (const manga of json.results) {
                const title = manga.data.attributes.title.en
                const chapter = manga.data.attributes.lastChapter
                const release = manga.data.attributes.updatedAt
                const test = new Date(release)
                console.log(test)
                const mangapacket: MangaPacket = {
                    Name: title,
                    Chapter: chapter,
                    TimeElapsed: convertTime(release),
                    Source: 'MangaDex'
                };
                MangaDexUpdates.push(mangapacket);

            }
        }
    )
    .catch(console.error); // Error handling
    return MangaDexUpdates;
}

// Needs to be fixed later
function convertTime(inputDate: string): number {
    const currentDate = new Date();
    const stampedDate = Date.parse(inputDate);
    const minutes = currentDate.getTime() / 60000 - stampedDate / 60000;
    return Math.round(minutes)
}