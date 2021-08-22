import { Request, Response, NextFunction } from 'express';
import * as firebaseAdmin from 'firebase-admin';

// Middleware to check if firebase token is valid
export async function isAuthorized(req: Request, res: Response, next: NextFunction): Promise<void> {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return next(res.status(401).send('Not Authorized'));
    }

    try {
        const token = authHeader.split(' ')[1];
        const payload = await firebaseAdmin.auth().verifyIdToken(token);

        if (!payload.uid) {
            return next(res.status(401).send('Not Authorized'));
        }

        // eslint-disable-next-line
        req.payload = payload as any;
    } catch (err) {
        return next(res.status(401).send('Not Authorized'));
    }

    return next();
}
