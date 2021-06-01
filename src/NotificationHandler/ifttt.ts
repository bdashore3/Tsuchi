import { MangaPacket } from 'types/sourceEntries';
import axios from 'axios';

export default async function sendIfttt(
    eventName: string,
    key: string,
    payload: MangaPacket
): Promise<void> {
    await axios.post(`https://maker.ifttt.com/trigger/${eventName}/with/key/${key}`, {
        value1: payload.Name,
        value2: payload.Chapter,
        value3: payload.Source
    });
}
