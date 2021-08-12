import { fetchUpdates } from '../SourceUpdates';
import { MangaPacket } from '../types';

export async function testSources(): Promise<void> {
    console.log('Running the updates test...');

    const updates = await fetchUpdates().catch((e) =>
        console.log(`There was an error when fetching updates! \n${e}`)
    );

    if (!updates) {
        return;
    }

    if ((updates as Array<MangaPacket>).length <= 0) {
        console.log(
            'No updates were fetched. \nEither the sources have no updates or check your internet connection?'
        );
    } else {
        console.log(`Updates found!`);
        console.log(updates);
        console.log();
        console.log('All updates have been listed above.');
    }
}
