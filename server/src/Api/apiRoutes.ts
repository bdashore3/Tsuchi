import { Router } from 'express';

const apiRouter = Router();

apiRouter.get('/', (req, res) => {
    res.send('Api base path');
});

apiRouter.get('/test', (req, res) => {
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
