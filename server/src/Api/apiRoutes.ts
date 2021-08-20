import { Router } from 'express';

const apiRouter = Router();

apiRouter.get('/', (req, res) => {
    res.send('Api base path');
});

export default apiRouter;
