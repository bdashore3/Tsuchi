// node server/dist/express_api/server.js

import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.send('Hello World');
});
app.get('/api', (req, res) => {
    res.send('API Base Path');
});

app.get('/api/authenticate/:username/:password', (req, res) => {
    // Hash Password and check hash ...

    res.send(`Username: ${req.params.username}<br>Password: ${req.params.password}`);
});

app.post('/api/authenticate', (req, res) => {
    // post_body is a json obj -> {username:u, password:p}
    const post_body = req.body;
    console.log(post_body);
    res.send('Auth for POST.');
});

app.get('/*', (req, res) => {
    res.send("<html><body><img src='https://http.cat/404'></body></html>");
});

app.listen(3000, () => console.log(`HTTP Server running on port 3000`));

// // runs the https, no need to change stuff here
// const httpServer = http.createServer(app);
// httpServer.listen(3000, () => {
//     console.log('HTTP Server running on port 3000');
// });
