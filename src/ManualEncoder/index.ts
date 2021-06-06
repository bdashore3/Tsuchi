import { promises as fs } from 'fs';
import { ManualSetupObject } from 'types/manualSetup';
import { MangaEntry, UserJson } from 'types/userJson';
import { removeExtraChars } from '../utils';

if (require.main === module) {
    main();
}

async function main() {
    const username = process.argv[2];
    if (username === '' || username === undefined) {
        console.log('Please provide a username in the first argument position!');

        return;
    }

    const textPath = process.argv[3];
    if (textPath === '' || textPath === undefined) {
        console.log('Please provide a path to the textfile in the second argument position!');

        return;
    }

    const userFile = await fs.readFile(`users/${username}.json`, 'utf8').catch(() => {
        console.log(
            "I tried getting your config, but it isn't there? \nCheck the entered username or run setup first!"
        );
    });

    if (!userFile) {
        return;
    }

    const userConfig: UserJson = JSON.parse(userFile);

    const manualBuffer = await parseTextFile(textPath);
    const titles = convertTitles(manualBuffer);

    userConfig.mangas = titles;

    await fs.writeFile(`users/${userConfig.user}.json`, JSON.stringify(userConfig, null, 2));
}

async function parseTextFile(path: string): Promise<Array<ManualSetupObject>> {
    const parentObject = [];

    const userText = await fs.readFile(path, 'utf8');
    const splitArray = userText.split('\n');

    const filteredArray = splitArray.filter((v) => v !== '');
    const sources = filteredArray.filter((v) => v.slice(v.length - 1) === ':');

    for (let i = 0; i < sources.length; i++) {
        const upperBound =
            i + 1 === sources.length
                ? filteredArray.length
                : filteredArray.indexOf(sources[i + 1]) - 1;

        const singleSourceArray = filteredArray.splice(
            filteredArray.indexOf(sources[i]) + 1,
            upperBound
        );

        const source = sources[i];

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

    manualBuffer.forEach((element) => {
        element.titles.forEach((title) => {
            titles.push({
                title: removeExtraChars(title).substring(1),
                source: element.source
            });
        });
    });

    return titles;
}
