// Generic type that will be used by all sources and notification handlers.
export type MangaPacket = {
    Name: string;
    Chapter: string;
    Image: string;
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
