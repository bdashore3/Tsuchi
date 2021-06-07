import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';

export default async function fetchDir(page: string): Promise<Array<string>> {
    const titles: Array<string> = [];

    const baseDomain =
        'https://manganato.com/advanced_search?s=all&sts=ongoing&orby=az&page=' + page;

    const html = await axios.get(baseDomain);

    const $ = cheerio.load(html.data, {
        xmlMode: false,
        decodeEntities: true
    });

    for (const manga of $('div.content-genres-item', 'div.panel-content-genres').toArray()) {
        const title = $('img', manga).first().attr('alt') ?? '';
        titles.push(title);
        fs.appendFile('src/SourceUpdates/text.txt', '- ' + title + '\n', function (err) {
            let a;
        });
    }

    return titles;
}
