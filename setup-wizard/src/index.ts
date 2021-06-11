import { promises as fs } from 'fs';
import promptSync from 'prompt-sync';
import { configureIfttt } from 'mangaupdates-server/dist/NotificationServices';
import { configureSpontit } from 'mangaupdates-server/dist/NotificationServices';
import { UserJson } from 'mangaupdates-server';

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
    const possibleServices = ['ifttt', 'spontit'];

    console.clear();
    console.log('Welcome to the MangaUpdates setup wizard!');
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

    console.clear();
    console.log('Please add your mangas manually or through the Paperback backup converter!');
    console.log(
        'To run the backup converter, use the `scrapeBackup` command after finishing this wizard'
    );

    let possibleServiceString = '';

    possibleServices.forEach(function (serviceName) {
        const concatString = `- ${serviceName} \n`;

        possibleServiceString = possibleServiceString + concatString;
    });

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

    userJson.user = username;
    userJson.services = services;

    await fs.writeFile(`./${username}.json`, JSON.stringify(userJson, null, 2));
}

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
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
            case 'spontit':
                const spontitResult = (userJson.spontit = configureSpontit());

                if (spontitResult === undefined) {
                    services.splice(index);
                } else {
                    userJson.spontit = spontitResult;
                }

                break;
        }
    });
}
