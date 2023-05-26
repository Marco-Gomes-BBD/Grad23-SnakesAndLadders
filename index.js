require('dotenv-flow').config();
const http = require('http');
const https = require('https');
const fs = require('fs');
const express = require('express');
const path = require('path');

const database = require('./database');

const port_http = process.env.PORT_HTTP || 8080;
const port_https = process.env.PORT_HTTPS || 8080;

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

const ssl_path = process.env.SSL_PATH || '';
const ssl_file_public_key = path.join(ssl_path, 'cert.pem');
const ssl_file_private_key = path.join(ssl_path, 'privkey.pem');
const ssl_file_chain = path.join(ssl_path, 'chain.pem');
const ssl_file_chainfull = path.join(ssl_path, 'chainfull.pem');
chain_files = [ssl_file_chain, ssl_file_chainfull];

const github_api_authorize = 'https://github.com/login/oauth/authorize';
const github_api_access_token = 'https://github.com/login/oauth/access_token';
const github_api_user = 'https://api.github.com/user';

const app = express();

const options = {
    cert: readFileSyncSafe(ssl_file_public_key),
    key: readFileSyncSafe(ssl_file_private_key),
    ca: readFilesSyncSafe(chain_files),
};

const server_http = http.createServer(app);
const server_https = https.createServer(options, app);

server_http.listen(port_http, () => {
    console.log(`Server started at http://localhost:${port_http}`);
});
server_https.listen(port_https, () => {
    console.log(`Server started at https://localhost:${port_https}`);
});

app.use(express.static('.'));

app.get('/home', function (_req, res) {
    res.sendFile(path.join(__dirname, 'src/pages/home_page.html'));
});

app.get('/game', function (_req, res) {
    res.sendFile(path.join(__dirname, 'src/pages/game_page.html'));
});

app.get('/player-select', function (_req, res) {
    res.sendFile(path.join(__dirname, 'src/pages/player_select.html'));
});

app.get('/auth', (_req, res) => {
    res.redirect(`${github_api_authorize}?client_id=${client_id}`);
});

app.get('/auth-callback', async (req, res) => {
    const code = req.query.code;
    const link = `${github_api_access_token}?client_id=${client_id}&client_secret=${client_secret}&code=${code}`;
    const requestOptions = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
        },
    };

    const response = await fetch(link, requestOptions);
    const data = await response.json();
    const details = await getDetails(data.access_token);
    console.log(details);
    res.cookie('token', data.access_token);
    res.redirect('/');
});

async function getDetails(token) {
    const link = github_api_user;
    const requestOptions = {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
    };

    const response = await fetch(link, requestOptions);
    const details = await response.json();
    return details;
}

function readFileSyncSafe(file) {
    try {
        return fs.readFileSync(file);
    } catch (err) {
        console.error(`Error reading file: ${file}`);
        return null;
    }
}

function readFilesSyncSafe(files) {
    return files.map(readFileSyncSafe).filter((cert) => cert !== null);
}

// Cleanup
server_https.on('close', () => {
    database.close();
});

process.on('SIGINT', () => {
    server_http.close();
    server_https.close();
});
