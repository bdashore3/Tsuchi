import { promises as fs } from 'fs';
import pgPromise from 'pg-promise';
import { GenericService, UserJson } from './types';
import { fetchUserJson } from './utils';

const PgPromise = pgPromise();

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const PgPool = PgPromise(
    process.env.DATABASE_URL
        ? process.env.DATABASE_URL
        : 'postgres://username:password@host:port/database'
);

// Fetch all pending user JSONs from the users directory
export async function prepareDbUpdate(): Promise<void> {
    const users = await fs.readdir('users').catch(() => {
        console.log('No JSONs in the users directory!');
    });

    if (!users) {
        return;
    }

    const promises: Array<Promise<void>> = [];
    for (const user of users) {
        const userConfig = await fetchUserJson(user);
        promises.push(updateDb(userConfig));
    }

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
    console.log(`Running manga delete task for ${userConfig.user}`);

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
    console.log(`Running manga insert task for ${userConfig.user}`);

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
    console.log(`Inserting/updating services for ${userConfig.user}`);

    const cs = new PgPromise.helpers.ColumnSet(
        ['service_name', 'api_name', 'api_secret', 'username'],
        { table: 'services' }
    );

    const genericServices: Array<GenericService> = [];

    for (const name of userConfig.services) {
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
    }

    const insertQuery =
        PgPromise.helpers.insert(genericServices, cs) +
        `ON CONFLICT(service_name, username)
        DO UPDATE SET
        api_name = EXCLUDED.api_name, api_secret = EXCLUDED.api_secret`;

    await PgPool.none(insertQuery);
}
