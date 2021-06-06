import { promises as fs } from 'fs';
import { UserJson } from 'types/userJson';

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
