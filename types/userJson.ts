export type UserJson = {
    user: string;
    mangas: Array<MangaEntry>;
};

export interface MangaEntry {
    title: string;
    source: string;
}
