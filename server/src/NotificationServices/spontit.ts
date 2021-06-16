import { MangaPacket, Spontit } from '../types';
import axios, { AxiosError } from 'axios';
import promptSync from 'prompt-sync';

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

    await axios.post(url, JSON.stringify(body), options).catch((err: AxiosError) => {
        switch (err.response?.status) {
            case 502:
                console.log('502: Bad gateway error on Spontit. Maybe the API is down?');
                break;
            default:
                console.log(err);
        }
    });
}

export function configureSpontit(): Spontit | undefined {
    const prompt = promptSync();

    let userId: string;
    let secretKey: string;

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

    console.log('\nService setup complete.');

    return spontit;
}
