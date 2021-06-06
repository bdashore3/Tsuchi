import anilist from 'anilist-node';
import { removeExtraChars } from '../utils';

export default async function fetchAnilist(username: string): Promise<Array<string>> {
    const userTitles: Array<string> = [];

    const Anilist = new anilist();

    await Anilist.lists.manga(username).then((data) => {
        const profile: Array<any> = data;

        for (const element of profile) {
            if (element.name != 'Reading') {
                continue;
            }
            const entry = element.entries;

            for (const elem of entry) {
                const titleArr = elem.media.title;
                if (titleArr.english == null) {
                    const title = removeExtraChars(titleArr.romaji);
                    userTitles.push(title);
                } else {
                    const title = removeExtraChars(titleArr.english);
                    userTitles.push(title);
                }
            }
        }
    });

    return userTitles;
}
