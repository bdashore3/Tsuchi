import { Ifttt, Spontit } from './services';

export type UserJson = {
    user: string;
    mangas: Array<MangaEntry>;
    services: Array<string>;
    ifttt?: Ifttt;
    spontit?: Spontit;
};

export interface MangaEntry {
    title: string;
    source: string;
}
