// To run: node server/dist/express_api/server.js
// API will send JSON responses to the frontend website/app

import express from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './authRoutes';
import apiRouter from './apiRoutes';

export function startApi(): void {
    const app = express();
    app.use(express.json());
    app.use(cookieParser());

    // Main route is /api from nginx
    app.use('/api', authRouter);
    app.use('/api', apiRouter);

    app.listen(3000, () => console.log(`Tsuchi API running on port 3000`));
}
