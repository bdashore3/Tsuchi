import { Router } from 'express';
import { PgPool } from '../dbHelper';

const apiRouter = Router();

apiRouter.get('/', (req, res) => {
    res.send('Api base path');
});

apiRouter.get('/mangas', async (req, res) => {
    const mangas = await PgPool.manyOrNone('SELECT title, source FROM mangas WHERE username = $1', [
        req.payload.uid
    ]);

    res.json(mangas);
});

apiRouter.put('/mangas', async (req, res) => {
    try {
        await PgPool.query('INSERT INTO mangas VALUES($1, $2, $3) ON CONFLICT DO NOTHING', [
            req.body.title,
            req.body.source,
            req.payload.uid
        ]);

        res.status(201).send(`Successfully added manga ${req.body.title} to the database`);
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal server error');
    }
});

apiRouter.delete('/mangas', async (req, res) => {
    try {
        await PgPool.query('DELETE FROM mangas WHERE username = $1 AND title = $2', [
            req.payload.uid,
            req.body.title
        ]);

        res.status(201).send(`Successfully deleted manga ${req.body.title} from the database`);
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal server error');
    }
});

apiRouter.get('/test_mangas', (req, res) => {
    res.json({
        mangas: [
            {
                title: 'koi to uso',
                source: 'mangalife'
            },
            {
                title: 'domestic kanojo',
                source: 'mangalife'
            }
        ]
    });
});

export default apiRouter;
