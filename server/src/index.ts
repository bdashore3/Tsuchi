import dotenv from 'dotenv';
dotenv.config();

import { prepareDbUpdate } from './dbHelper';
import { dispatchServerUpdate } from './Updater/serverUpdates';
import { dispatchLocalUpdate } from './Updater/localUpdates';
import { dispatchTests } from './Tests';
import { startApi } from './Api/express';

if (require.main === module) {
    main().catch((err) => console.log(`Uncaught exception: \n\n${err}`));
}

async function main() {
    dotenv.config();
    const args = process.argv.slice(2);

    if (process.env.DATABASE_URL) {
        console.log('A database URL has been provided! Using the server-based configuration...');

        // Initial dispatch update call and initial database update prep
        console.log('Checking for and adding new users...');
        await prepareDbUpdate();
        startApi();

        if (args[0] !== '--test') {
            console.log('Running initial update event');
            await dispatchServerUpdate();

            console.log('Setting an update interval of 30 minutes');
            setInterval(async () => {
                await dispatchServerUpdate();
                await prepareDbUpdate();
            }, 1.8e6);
        }
    } else {
        console.log(
            'A database URL was not provided in your configuration! Falling back to single-user mode.'
        );

        if (args[0] !== '--test') {
            console.log('Running initial update event');
            await dispatchLocalUpdate();

            console.log('Setting an update interval of 30 minutes');
            setInterval(async () => {
                await dispatchLocalUpdate();
            }, 1.8e6);
        }
    }

    /*
     * Dispatch updates on an interval every 30 minutes.
     * Also check if there are any JSON files to update the database
     */
    if (args[0] === '--test') {
        await dispatchTests(args[1]);
    } else {
        console.log('Update interval successfully set');
    }
}
