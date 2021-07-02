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
