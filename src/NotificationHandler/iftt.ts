import { MangaPacket } from 'types/sourceEntries';
import axios from 'axios';


export class Ifttt {

    constructor(private key: string, private value: string) {}

    async sendNotification(mangapacket: MangaPacket): Promise<void> {

        var a;
        var b;
    }
}