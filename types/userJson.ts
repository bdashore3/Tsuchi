import { Ifttt } from './services';

export type UserJson = {
    user: string;
    mangas: Array<MangaEntry>;
    services: Array<string>;
    ifttt?: Ifttt;
};

export interface MangaEntry {
    title: string;
    source: string;
}
