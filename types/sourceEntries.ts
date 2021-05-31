// Generic type that will be used by all sources and notification handlers.
export type MangaPacket = {
    Name: string;
    Chatper: string;
    TimeElapsed: number; // in Minutes
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
