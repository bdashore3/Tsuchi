import { Pool } from 'pg';

export let PgPool: Pool = new Pool();

export function configurePool(url: string | undefined): void {
    if (url !== undefined) {
        PgPool = new Pool({
            connectionString: url
        });
    }
}
