import { AxiosResponse } from 'axios';

// Generic type that will be used by all sources and notification handlers.
export type MangaPacket = {
    Name: string;
    Chapter: string;
    Image?: string;
    Source: string;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export type CloudFlareResponse = {
    response: AxiosResponse<any>;
    cookies: string;
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
