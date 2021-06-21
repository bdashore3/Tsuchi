import fetchFromGenkan from './GenkanParaer';
import { MangaPacket } from '../../types';

export default async function fetchReaperScans(): Promise<Array<MangaPacket>> {
    const baseDomain = 'https://reaperscans.com/';
    const source = 'Reaper Scans';

    const update: Array<MangaPacket> = await fetchFromGenkan(baseDomain, source);

    return update;
}
