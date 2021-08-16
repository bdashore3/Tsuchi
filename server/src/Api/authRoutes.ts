/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { compare, hash } from 'bcrypt';
import express from 'express';
import { PgPool } from '../Config/PgPool';

const authRouter = express.Router();

// Will be removed once auth is complete
authRouter.get('/users', async (req, res) => {
    const users = await PgPool.query('SELECT * FROM users');

    res.json(users);
});

authRouter.get('/signup', (req, res) => {
    res.send('signup page placeholder');
});

authRouter.post('/signup', async (req, res) => {
    console.log('called signup route!');

    try {
        const username = req.body.username;
        const hashedPassword = await hash(req.body.password, 10);

        // Add way to say this user already exists
        await PgPool.query('INSERT INTO users VALUES($1, $2)', [username, hashedPassword]);

        res.status(201).json({ username: username });
    } catch (err) {
        console.log(err);

        if (err.code === '23505') {
            res.status(400).send('This username already exists!');
        } else {
            res.status(500).send('Oops, random internal error.');
        }
    }
});

authRouter.get('/login', (req, res) => {
    res.send('login page placeholder');
});

authRouter.post('/login', async (req, res) => {
    const user = await PgPool.oneOrNone(
        'SELECT username, password FROM users WHERE username = $1',
        [req.body.username]
    );

    if (user === null) {
        return res.status(400).send('Cannot find user');
    }

    try {
        if (await compare(req.body.password, user.password)) {
            res.json({ username: user.username });
        } else {
            res.send('That username/password pair is incorrect');
        }
    } catch (err) {
        console.log(err);

        res.status(500).send('Oops, error.');
    }
});

authRouter.get('/*', (req, res) => {
    res.status(404).send();
});

export default authRouter;
