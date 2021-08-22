// To run: node server/dist/express_api/server.js
// API will send JSON responses to the frontend website/app

import express from 'express';
import cors from 'cors';
import authRouter from './authRoutes';
import apiRouter from './apiRoutes';

export function startApi(): void {
    const app = express();
    const port = 4000;
    app.use(cors());
    app.use(express.json());

    // Main route is /api from nginx
    app.use('/api', authRouter);
    app.use('/api', apiRouter);

    app.listen(port, () => console.log(`Tsuchi API running on port ${port}`));
}
