import { promises as fs } from 'fs';
import promptSync from 'prompt-sync';
import { configureIfttt } from 'tsuchi-server/dist/NotificationServices';
import { UserJson } from 'tsuchi-server';
import { sleep } from './utils';
import { handlePaperback } from './paperback';
import { handleManual } from './manual';

const userJson: UserJson = {
    user: '',
    mangas: [],
    services: []
};

if (require.main === module) {
    main();
}

async function main() {
    const prompt = promptSync();
    const possibleBackups = ['paperback', 'manual'];
    const possibleServices = ['ifttt'];

    console.clear();
    console.log('Welcome to the Tsūchi setup wizard!');
    console.log('This will setup a user configuration for the update server.');
    console.log('Please follow the prompts. \n');
    console.log(
        'You can exit the program at any time by hitting ctrl + c multiple times or by closing out the executable.'
    );
    await sleep(4000);

    console.clear();

    let username;
    while (true) {
        console.log('What is the username you want to be referred by? ');
        username = prompt('> ');

        if (username === '') {
            console.log('Please provide a valid username!');
        } else {
            console.log();
            break;
        }
    }

    userJson.user = username;

    let possibleBackupString = '';

    for (const backupType of possibleBackups) {
        const concatString = `- ${backupType} \n`;

        possibleBackupString = possibleBackupString + concatString;
    }

    while (true) {
        console.clear();
        console.log(
            'Tsūchi requires you to have a list or a reader backup to load into your configuration file!'
        );
        console.log("If you don't see your app here, choose manual.");
        console.log('Pick a backup type from the list of possible apps: ');
        console.log(possibleBackupString);
        const backupChoice = prompt('> ').toLowerCase();

        switch (backupChoice) {
            case 'paperback':
                userJson.mangas = await handlePaperback(prompt);
                break;
            case 'manual':
                userJson.mangas = await handleManual(prompt, userJson.user);
                break;
            default:
                console.log('Please enter a listed backup method!');
                await sleep(2000);
                continue;
        }

        break;
    }

    console.log();
    console.log('Now moving on to notification service input...');
    await sleep(2000);

    let possibleServiceString = '';

    for (const serviceName of possibleServices) {
        const concatString = `- ${serviceName} \n`;

        possibleServiceString = possibleServiceString + concatString;
    }

    let services: Array<string> = [];
    while (true) {
        console.clear();
        console.log('Pick a service from the list of possible services: ');
        console.log(possibleServiceString);
        console.log(`Your services: [${services}] \n`);
        if (services.length >= 1) {
            console.log('Type in `next` if you want to proceed without adding new services \n');
        }
        const service = prompt('> ').toLowerCase();

        // Exit recursion on adding services prompt
        if (service === 'next' && services.length >= 1) {
            console.log('Alright. Continuing...');
            await sleep(2000);
            break;
        }

        if (service === '' || !possibleServices.includes(service)) {
            console.log('Please enter a valid service!');
            await sleep(2000);
            continue;
        }

        services.push(service);
        services = [...new Set(services)];

        const again = prompt('Would you like to enter more services (y/n)? ');
        if (['y', 'Y'].includes(again)) {
            continue;
        } else if (['n', 'N'].includes(again)) {
            console.log('Alright. Continuing...');
            await sleep(2000);
            break;
        }
    }

    console.clear();
    console.log('You will now be taken to set up each service. Please follow the prompts.');
    await sleep(2000);
    setupServices(services);
    await sleep(2000);
    console.clear();

    if (services.length > 0) {
        userJson.services = services;

        await fs.writeFile(`./${username}.json`, JSON.stringify(userJson, null, 2));

        console.log('Looks like setup was successful!');
        console.log('Take a look in the directory of this executable for a JSON file! \n');
        console.log(`Your configuration file: ${username}.json \n`);
        console.log(
            "If you aren't using an individual server, please send the file to kingbri or nmn!"
        );
    } else {
        console.log('Looks like an error occured! Please re-run the program!');
    }
}

function setupServices(services: Array<string>) {
    services.forEach((service, index) => {
        switch (service.toLowerCase()) {
            case 'ifttt':
                const iftttResult = configureIfttt();

                if (iftttResult === undefined) {
                    services.splice(index);
                } else {
                    userJson.ifttt = iftttResult;
                }

                break;
        }
    });
}
