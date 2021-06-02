import { MangaPacket } from 'types/sourceEntries';
import axios from 'axios';
import promptSync from 'prompt-sync';
import { Ifttt } from 'types/services';

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

export function configureIfttt(): Ifttt | undefined {
    const prompt = promptSync();

    let event_name;
    let key;

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

    return ifttt;
}
