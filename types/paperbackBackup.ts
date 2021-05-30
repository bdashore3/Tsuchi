// Generated using QuickType https://app.quicktype.io/

export type PBBackup = {
    library: Library[];
    sourceMangas: SourceMangas[];
    chapterMarkers: any[];
    backupSchemaVersion: number;
    date: number;
    tabs: any[];
    version: string;
    sourceRepositories: SourceRepository[];
    activeSources: ActiveSource[];
};

export interface ActiveSource {
    author: string;
    desc: string;
    website: string;
    id: string;
    tags: ActiveSourceTag[];
    repo: string;
    websiteBaseURL: string;
    version: string;
    icon: string;
    name: string;
}

export interface ActiveSourceTag {
    type: string;
    text: string;
}

export interface Library {
    lastRead: number;
    manga: Manga;
    lastUpdated: number;
    dateBookmarked: number;
    libraryTabs: any[];
    updates: number;
}

export interface Manga {
    rating: number;
    id: string;
    description: string;
    follows: number;
    views: number;
    author: string;
    users: number;
    langFlag: string;
    covers: any[];
    tags: MangaTag[];
    titles: string[];
    image: string;
    hentai: boolean;
    langName: string;
    artist: string;
    status: number;
    avgRating: number;
}

export interface MangaTag {
    id: string;
    label: Label;
    tags: TagTag[];
}

export enum Label {
    Format = 'format',
    Genres = 'genres'
}

export interface TagTag {
    id: string;
    value: string;
}

export interface SourceMangas {
    id: string;
    manga: Manga;
    originalInfo: Manga;
    sourceId: string;
}

export interface SourceRepository {
    name: string;
    url: string;
}
