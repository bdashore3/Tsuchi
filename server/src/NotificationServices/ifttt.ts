import { MangaPacket, Ifttt } from '../types';
import axios from 'axios';
import promptSync from 'prompt-sync';
import { renameChapter } from '../utils';

export default async function sendIfttt(
    eventName: string,
    key: string,
    payload: MangaPacket
): Promise<void> {
    // Adding chapter prefix to string where sources like mangalife pass only chapter numbers
    const chapter = renameChapter(payload.Chapter);
    const description = `${chapter} updated from ${payload.Source}`;

    await axios
        .post(`https://maker.ifttt.com/trigger/${eventName}/with/key/${key}`, {
            value1: payload.Name,
            value2: description,
            value3: payload.Image
        })
        .catch((err) => console.log(err));
}

export function configureIfttt(): Ifttt | undefined {
    const prompt = promptSync();

    let event_name: string;
    let key: string;

    console.clear();

    console.log('IFTTT setup \n');
    while (true) {
        console.log('Please enter your applet event name below');
        event_name = prompt('> ');

        if (event_name === '') {
            console.log('Please enter an event name!');
        } else {
            break;
        }
    }

    while (true) {
        console.log('Alright, please enter your ifttt webhook key');
        key = prompt('> ');

        if (event_name === '') {
            console.log('Please enter a key!');
        } else {
            break;
        }
    }

    if (event_name === null || key === null) {
        return;
    }

    const ifttt = {
        event_name: event_name,
        key: key
    };

    console.log('\nService setup complete.');

    return ifttt;
}
