import { promises as fs } from 'fs';
import promptSync from 'prompt-sync';
import { configureIfttt } from '../NotificationHandler/ifttt';
import { configureSpontit } from '../NotificationHandler/spontit';
import { UserJson } from 'types/userJson';
// import { Color } from 'types/enums';
import { cpuUsage } from 'process';

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
    let msg = `Pick a service from the list of possible services: `;
    while (true) {
        console.clear();
        console.log(msg);
        console.log(possibleServiceString);
        console.log(`Your services: [${services}]`);
        console.log();
        const service = prompt('> ');

        // Exit recursion on adding services prompt
        if (['exit', 'stop', 'n'].includes(service.toLowerCase())) {
            console.clear();
            console.log('\x1b[33m' + 'EXITITNG PROGRAM!..\nEXITITNG PROGRAM!..' + '\x1b[0m');
            break;
        }

        if (service === '' || !possibleServices.includes(service.toLowerCase())) {
            msg =
                "NOTE:\x1b[31m'exit' 'N/n'\x1b[0m to STOP adding services to the list\n\nPlease enter a valid service!";
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

// Change into enums later
// Color List used in console
/*
Reset = "\x1b[0m"
Bright = "\x1b[1m"
Dim = "\x1b[2m"
Underscore = "\x1b[4m"
Blink = "\x1b[5m"
Reverse = "\x1b[7m"
Hidden = "\x1b[8m"

FgBlack = "\x1b[30m"
FgRed = "\x1b[31m"
FgGreen = "\x1b[32m"
FgYellow = "\x1b[33m"
FgBlue = "\x1b[34m"
FgMagenta = "\x1b[35m"
FgCyan = "\x1b[36m"
FgWhite = "\x1b[37m"

BgBlack = "\x1b[40m"
BgRed = "\x1b[41m"
BgGreen = "\x1b[42m"
BgYellow = "\x1b[43m"
BgBlue = "\x1b[44m"
BgMagenta = "\x1b[45m"
BgCyan = "\x1b[46m"
BgWhite = "\x1b[47m"
*/
