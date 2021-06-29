import pgPromise from 'pg-promise';

const pgp = pgPromise();

// Dummy pool string
export let PgPool = pgp('postgres://username:password@host:port/database');

export function configurePool(url: string | undefined): void {
    if (url !== undefined) {
        PgPool = pgp(url);
    }
}
