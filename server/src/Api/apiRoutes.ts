import express from 'express';

const apiRouter = express.Router();

apiRouter.get('/', (req, res) => {
    res.send('API Base Path');
});

export default apiRouter;
