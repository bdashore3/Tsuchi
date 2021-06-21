import { promises as fs } from 'fs';
import { UserJson } from './types';

// Fetches user configuration.
export async function fetchUserJson(userFile: string): Promise<UserJson> {
    const file = await fs.readFile(`users/${userFile}`, 'utf8');
    const userJson = JSON.parse(file);

    return userJson;
}

// Removes extra punctuation and whitespace from a manga title.
export function removeExtraChars(title: string): string {
    const puncRegex = /[!"#$%&()*+,-.\/:;<=>?@[\]^_`{|}~]/g;
    const spaceRegex = /\s+/g;

    const strippedString = title
        .toLowerCase()
        .replaceAll("'", '')
        .replace(puncRegex, ' ')
        .replace(spaceRegex, ' ')
        .trim();

    return strippedString;
}

export function renameChapter(chapterString: string): string {
    if (parseFloat(chapterString)) {
        return `Chapter ${chapterString}`;
    } else {
        return chapterString;
    }
}

export function calculateTime(time: string): number {
    const arr = time.split(' ');
    const int: number = +arr[0];

    if (arr[1] == 'mins') {
        return int;
    } else if (arr[1] == 'secs') {
        // If seconds in the latest update, it would return as 1 minute old
        return 1;
    } else {
        return 100;
    }
}
