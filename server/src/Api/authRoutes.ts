import { Router } from 'express';
import { PgPool } from '../dbHelper';

const authRouter = Router();

// Adds firebase UID to database to identify the user
// Since OAuth sign-in is used, register and login do the same thing.
authRouter.put('/register', async (req, res) => {
    try {
        await PgPool.query('INSERT INTO users VALUES($1) ON CONFLICT DO NOTHING', [
            req.payload.uid
        ]);

        res.status(201).send('User signup successful');
    } catch (err) {
        res.status(500).send('Oops, random internal error.');
    }
});

export default authRouter;
