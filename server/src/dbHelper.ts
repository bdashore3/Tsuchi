import { promises as fs } from 'fs';
import { PgPool, PgPromise } from './Config/PgPool';
import { GenericService, UserJson } from './types';
import { fetchUserJson } from './utils';

// Fetch all pending user JSONs from the users directory
export async function prepareDbUpdate(): Promise<void> {
    const users = await fs.readdir('users').catch(() => {
        console.log('No JSONs in the users directory!');
    });

    if (!users) {
        return;
    }

    const promises: Array<Promise<void>> = [];
    users.forEach(async (user) => {
        const userConfig = await fetchUserJson(user);
        console.log(userConfig);

        promises.push(updateDb(userConfig));
    });

    await Promise.allSettled(promises);
}

// Main database update function
async function updateDb(userConfig: UserJson) {
    // Add new usernames
    await PgPool.none('INSERT INTO users VALUES($1) ON CONFLICT DO NOTHING', [userConfig.user]);

    await handleDbServices(userConfig);
    await deleteOldMangas(userConfig);
    await insertNewMangas(userConfig);

    // Remove the JSON since everything was successfully added
    await fs.unlink(`users/${userConfig.user}.json`);
}

// Remove mangas that aren't present in the user JSON
async function deleteOldMangas(userConfig: UserJson) {
    const dbMangas = await PgPool.any(
        'SELECT title, source, username FROM mangas WHERE username = $1',
        [userConfig.user]
    );

    const delMangas: Array<string> = dbMangas
        .filter((dbManga) => {
            const exists = userConfig.mangas.some((userManga) => {
                return (
                    dbManga.title === userManga.title &&
                    dbManga.source === userManga.source &&
                    dbManga.username === userConfig.user
                );
            });

            return !exists;
        })
        .map((dbManga) => dbManga.title);

    await PgPool.none('DELETE FROM mangas WHERE username = $1 AND title = any ($2)', [
        userConfig.user,
        delMangas
    ]);
}

// Add new mangas for a user. On a conflict, skip.
async function insertNewMangas(userConfig: UserJson) {
    const cs = new PgPromise.helpers.ColumnSet(['title', 'source', 'username'], {
        table: 'mangas'
    });

    const formattedMangas = userConfig.mangas.map((manga) => {
        const mangaObject = {
            title: manga.title,
            source: manga.source,
            username: userConfig.user
        };

        return mangaObject;
    });

    const insertQuery = PgPromise.helpers.insert(formattedMangas, cs) + 'ON CONFLICT DO NOTHING';

    await PgPool.none(insertQuery);
}

// Insert/update notification services. A removal function isn't required at this time
async function handleDbServices(userConfig: UserJson) {
    const cs = new PgPromise.helpers.ColumnSet(
        ['service_name', 'api_name', 'api_secret', 'username'],
        { table: 'services' }
    );

    const genericServices: Array<GenericService> = [];

    userConfig.services.forEach((name) => {
        switch (name) {
            case 'ifttt':
                genericServices.push({
                    service_name: name,
                    api_name: userConfig.ifttt?.event_name,
                    api_secret: userConfig.ifttt?.key,
                    username: userConfig.user
                });
                break;
        }
    });

    const insertQuery =
        PgPromise.helpers.insert(genericServices, cs) +
        `ON CONFLICT(service_name, username)
        DO UPDATE SET
        api_name = EXCLUDED.api_name, api_secret = EXCLUDED.api_secret`;

    await PgPool.none(insertQuery);
}