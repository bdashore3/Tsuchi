import { MangaPacket } from 'types/sourceEntries';
import axios from 'axios';
import promptSync from 'prompt-sync';
import { Spontit } from 'types/services';

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
        content: `${payload.Chapter} updated from ${payload.Source}`
    };

    await axios.post(url, JSON.stringify(body), options);
}

export function configureSpontit(): Spontit | undefined {
    const prompt = promptSync();

    let userId;
    let secretKey;

    console.clear();

    console.log('Spontit setup \n');
    while (true) {
        console.log('Please enter your profile User ID below');
        userId = prompt('> ');

        if (userId === '') {
            console.log('Please enter a user name');
        } else {
            break;
        }
    }

    while (true) {
        console.log('Alright, please enter your spontit secret API key');
        secretKey = prompt('> ');

        if (secretKey === '') {
            console.log('Please enter API key');
        } else {
            break;
        }
    }

    if (userId === null || secretKey === null) {
        return;
    }

    const spontit = {
        userId: userId,
        secretKey: secretKey
    };
    return spontit;
}
