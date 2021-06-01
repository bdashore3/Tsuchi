import { MangaPacket } from 'types/sourceEntries';
import axios from 'axios';

export default async function sendSpontit(
    userId: string,
    secretKey: string,
    payload: MangaPacket
): Promise<void> {
    const url = 'https://api.spontit.com/v3/push';
    const options = {
        headers: {
            'X-Authorization': secretKey,
            'X-UserId': userId
        }
    };
    const body = {
        pushTitle: payload.Name,
        content: `Chapter ${payload.Chapter} updated from ${payload.Source}`
    };

    axios.post(url, JSON.stringify(body), options);
}
