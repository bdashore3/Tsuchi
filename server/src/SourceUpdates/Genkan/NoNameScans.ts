import fetchFromGenkan from './GenkanParaer';
import { MangaPacket } from '../../types';

export default async function fetchNoNameScans(): Promise<Array<MangaPacket>> {
    const baseDomain = 'https://the-nonames.com/';
    const source = 'The NoNames Scans';

    const update: Array<MangaPacket> = await fetchFromGenkan(baseDomain, source);

    return update;
}
