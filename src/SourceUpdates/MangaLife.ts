import axios from 'axios';
import cheerio from 'cheerio';
import { MangaLifeEntry } from 'types/sourceEntries';

export async function fetchMangaLife(): Promise<Array<MangaLifeEntry>> {
    const baseDomain = 'https://manga4life.com/';

    const html = await axios.get(baseDomain);
    const $ = cheerio.load(html.data, {
        xmlMode: false,
        decodeEntities: true
    });

    const child = $('script').get()[16].children[0];

    const data: string = (<any>child).data;

    const mangaLifeUpdates: Array<MangaLifeEntry> = JSON.parse(
        data
            .substring(
                data.lastIndexOf('vm.LatestJSON = [{') + 16,
                data.lastIndexOf('vm.NewSeriesJSON = [{')
            )
            .slice(0, -5)
    );

    return mangaLifeUpdates;
}
