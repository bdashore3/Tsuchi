import { promises as fs } from 'fs';
import { PgPool } from '../dbHelper';
import { handleServices as handleDbServices } from '../Updater/serverUpdates';
import { handleServices as handleLocalServices } from '../Updater/localUpdates';
import { MangaPacket } from '../types';
import { fetchUserJson } from '../utils';

export async function sendTestNotification(): Promise<void> {
    console.log('Running the notification test');

    const testUpdate: MangaPacket = {
        Name: 'Tsūchi test manga',
        Chapter: '420',
        Source: 'Tsūchi',
        Image: 'https://files.kingbri.dev/.public-app-assets/Tsuchi/KujouKaren.jpg'
    };

    let users;

    if (process.env.DATABASE_URL) {
        users = await PgPool.any('SELECT username FROM users');
    } else {
        users = await fs.readdir('users').catch(() => {
            console.log('No user JSONs in the users directory!');
        });
    }

    if (!users) {
        return;
    }

    for (const user of users) {
        let username;

        if (process.env.DATABASE_URL) {
            username = user.username;
            const userServices = await PgPool.any(
                'SELECT service_name, api_name, api_secret FROM services WHERE username = $1',
                [username]
            );

            await handleDbServices(userServices, testUpdate);
        } else {
            const userJson = await fetchUserJson(user);
            username = userJson.user;

            await handleLocalServices(userJson, testUpdate);
        }

        console.log(`Event dispatched for ${username}! Check your notification device.`);
    }
}
