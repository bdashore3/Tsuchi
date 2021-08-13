import { promises as fs } from 'fs';
import { ManualSetupObject } from './types';
import { MangaEntry } from 'tsuchi-server';
import { removeExtraChars } from 'tsuchi-server/dist/utils';
import { sleep } from './utils';
import { Prompt } from 'prompt-sync';

export async function handleManual(prompt: Prompt, username: string): Promise<Array<MangaEntry>> {
    console.clear();
    console.log('Manual manga list conversion \n');

    let rawBackupText;

    // Read the backup JSON file and cast it to a PBBackup type
    while (true) {
        console.log(
            `To convert a manual manga list, Please put your textfile in the same directory`
        );
        console.log(`as this executable and rename it to ${username}.txt. \n`);
        console.log('Hit enter once you have finished this task.');
        prompt('> ');

        try {
            rawBackupText = await fs.readFile(`./${username}.txt`, 'utf8');
        } catch (e) {
            console.log("Looks like your manual textfile couldn't be read!");
            console.log(
                `Make sure you have your formatted manga list in the same folder as this executable and name it ${username}.txt! (case sensitive)`
            );
            await sleep(2000);

            console.clear();
            continue;
        }

        break;
    }

    const manualBuffer = parseTextFile(rawBackupText);
    const titles = convertTitles(manualBuffer);

    console.log('Parsing complete.');

    return titles;
}

function parseTextFile(userText: string): Array<ManualSetupObject> {
    const parentObject = [];

    const splitArray = userText.split('\n');

    const filteredArray = splitArray.filter((v) => v !== '');
    const sources = filteredArray.filter((v) => v.slice(v.length - 1) === ':');

    for (let i = 0; i < sources.length; i++) {
        const upperBound =
            i + 1 === sources.length ? filteredArray.length : filteredArray.indexOf(sources[i + 1]);

        const source = sources[i];
        const singleSourceArray = filteredArray.slice(
            filteredArray.indexOf(source) + 1,
            upperBound
        );

        const sampleObject: ManualSetupObject = {
            source: source.substring(0, source.length - 1).toLowerCase(),
            titles: singleSourceArray
        };

        parentObject.push(sampleObject);
    }

    return parentObject;
}

function convertTitles(manualBuffer: Array<ManualSetupObject>): Array<MangaEntry> {
    const titles: Array<MangaEntry> = [];

    for (const element of manualBuffer) {
        for (const title of element.titles) {
            titles.push({
                title: removeExtraChars(title),
                source: element.source
            });
        }
    }

    return titles;
}
