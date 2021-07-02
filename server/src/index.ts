import { handleCredentials } from './Config/credentialsHelper';
import { configurePool } from './Config/PgPool';
import { prepareDbUpdate } from './dbHelper';
import { dispatchServerUpdate } from './Updater/serverUpdates';
import { dispatchLocalUpdate } from './Updater/localUpdates';

if (require.main === module) {
    main().catch((err) => console.log(`Uncaught exception: \n\n${err}`));
}

async function main() {
    const args = process.argv.slice(2);
    const creds = await handleCredentials(args[0]);

    if (creds.DBUrl) {
        console.log('A database URL has been provided! Using the server-based configuration...');

        // All internal service configuration goes here
        configurePool(creds.DBUrl);

        // Clear sensitive credentials for security
        creds.DBUrl = undefined;

        // Initial dispatch update call and initial database update prep
        console.log('Checking for and adding new users...');
        await prepareDbUpdate();

        console.log('Running initial update event');
        await dispatchServerUpdate();

        console.log('Setting an update interval of 30 minutes');
        setInterval(async () => {
            await dispatchServerUpdate();
            await prepareDbUpdate();
        }, 1.8e6);
    } else {
        console.log(
            'A database URL was not provided in your configuration! Falling back to single-user mode.'
        );

        console.log('Running initial update event');
        await dispatchLocalUpdate();

        console.log('Setting an update interval of 30 minutes');
        setInterval(async () => {
            await dispatchLocalUpdate();
        }, 1.8e6);
    }

    /*
     * Dispatch updates on an interval every 30 minutes.
     * Also check if there are any JSON files to update the database
     */

    console.log('Update interval successfully set');
}
