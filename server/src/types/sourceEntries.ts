// Generic type that will be used by all sources and notification handlers.
export type MangaPacket = {
    Name: string;
    Chapter: string;
    Image?: string;
    Source: string;
};

export type MangaLifeEntry = {
    SeriesId: string;
    IndexName: string;
    SeriesName: string;
    ScanStatus: string;
    Chapter: string;
    Genres: string;
    Date: string;
    IsEdd: boolean;
};

export type BakaUpdatesData = {
    items: Array<BakaUpdatesDetails>;
    title: string;
    description: string;
    link: string;
};

export type BakaUpdatesDetails = {
    title: string;
    link?: string;
    content: string;
    contentSnippet?: string;
};

export type MangaDexEntry = {
    results: Array<MangaDexResult>;
};

export interface MangaDexResult {
    data: MangaDexData;
    relationships: Array<MangaDexRelationship>;
}

export interface MangaDexData {
    id: string;
    attributes: MangaDexDataAttributes;
}

export interface MangaDexDataAttributes {
    chapter: string;
    title: null | string;
    updatedAt: string;
}

export interface MangaDexRelationship {
    id: string;
    type: string;
    attributes: MangaDexRelationshipAttributes;
}

export interface MangaDexRelationshipAttributes {
    title: MangaDexTitle;
}

export interface MangaDexTitle {
    en: string;
}
