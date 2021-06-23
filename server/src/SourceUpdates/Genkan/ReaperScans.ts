import fetchFromGenkan from './GenkanParser';
import { MangaPacket } from '../../types';

// Disabled due to error 1020
export default async function fetchReaperScans(): Promise<Array<MangaPacket>> {
    const baseDomain = 'https://reaperscans.com/';
    const source = 'Reaper Scans';

    const update: Array<MangaPacket> = await fetchFromGenkan(baseDomain, source);

    return update;
}
