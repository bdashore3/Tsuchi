import pgPromise from 'pg-promise';

export const PgPromise = pgPromise();

// Dummy pool string
export let PgPool = PgPromise('postgres://username:password@host:port/database');
export let useDb = false;

export function configurePool(url: string | undefined): void {
    if (url !== undefined) {
        useDb = true;
        PgPool = PgPromise(url);
    }
}
