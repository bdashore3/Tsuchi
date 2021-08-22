import { Router } from 'express';
import { PgPool } from '../dbHelper';

const authRouter = Router();

// Adds firebase UID to database to identify the user
authRouter.put('/register', async (req, res) => {
    try {
        await PgPool.query('INSERT INTO users VALUES($1)', [req.payload.uid]);

        res.status(201).send('User signup successful');
    } catch (err) {
        console.log(err);

        if (err.code === '23505') {
            res.status(400).send('This username already exists!');
        } else {
            res.status(500).send('Oops, random internal error.');
        }
    }
});

export default authRouter;
