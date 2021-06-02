import { promises as fs } from 'fs';
import promptSync from 'prompt-sync';
import { configureIfttt } from '../NotificationHandler/ifttt';
import { configureSpontit } from '../NotificationHandler/spontit';
import { UserJson } from 'types/userJson';

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

    let possibleServiceString = '';

    possibleServices.forEach(function (serviceName) {
        const concatString = `- ${serviceName} \n`;

        possibleServiceString = possibleServiceString + concatString;
    });

    let services: Array<string> = [];
    while (true) {
        console.clear();
        console.log(`Pick a service from the list of possible services: `);
        console.log(possibleServiceString);
        console.log(`Your services: [${services}]`);
        console.log();
        const service = prompt('> ');

        // TODO: Add a way to bail on recurse
        if (service === '' || !possibleServices.includes(service.toLowerCase())) {
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
            console.log();
            break;
        }
    }

    setupServices(services);

    userJson.user = username;
    userJson.services = services;

    await fs.writeFile(`users/${username}.json`, JSON.stringify(userJson, null, 2));
}

function setupServices(services: Array<string>) {
    services.forEach((service) => {
        switch (service.toLowerCase()) {
            case 'ifttt':
                userJson.ifttt = configureIfttt();
                break;
            case 'spontit':
                userJson.spontit = configureSpontit();
                break;
        }
    });
}
