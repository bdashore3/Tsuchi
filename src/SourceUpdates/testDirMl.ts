import axios from 'axios';
import { promises as fs } from 'fs';

export default async function fetchDir(): Promise<void> {
    const baseDomain = 'https://manga4life.com/directory/';

    const html = await axios.get(baseDomain);

    const rawUpdates = JSON.parse(html.data.match(/vm.FullDirectory = (.*);/)?.[1]);

    type test = {
        i: string;
        s: string;
        st: string;
        g: Array<string>;
    };

    const dir: Array<test> = rawUpdates.Directory;
    const titles: Array<string> = [];

    type dict = {titles: Array<string>};
    const dic: dict = { titles: [] };

    dir.forEach((element) => {
        titles.push(element.s);
    });

    dic.titles = titles;

    await fs.writeFile('src/SourceUpdates/testall.json', JSON.stringify(dic, null, 2));
}
