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

app.get('/load-game', (_req, res) => {
    res.sendFile(path.join(__dirname, 'src/pages/load_game_page.html'))
})

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
    res.redirect('/home');
});

app.get('/user-details', async (req, res) => {

    const details = await getDetails(req.query.token);

    res.json({login: details.login, avatar_url: details.avatar_url})
})

app.get('/game/new', async (req, res) => {
    const token = req.query.token
    const game = req.query.game
    console.log(req)

    // TODO: add game to database
    // TODO: append game_id to game

    let game_id = 12345

    res.json({game_id: game_id})
})

app.get('/game/playing', async (req, res) => {
    const token = req.query.token

    // TODO: return unfinished games

    res.json([
        {
            game_id: 123,
            board: {
                seed: "please",
                width: 10,
                height: 10,
            },
            roll: {
                seed: "work",
                count: 0,
            },
            players: [
                {player_name : "Player 1", player_color : "red", player_type : "human"},
                {player_name : "Player 2", player_color : "pink", player_type : "human"},
                {player_name : "Player 3", player_color : "purple", player_type : "human"}
            ]
        },

        {
            game_id: 321,
            board: {
                seed: "HEHE",
                width: 10,
                height: 10,
            },
            roll: {
                seed: "HOHO",
                count: 0,
            },
            players: [
                {player_name : "Player 1", player_color : "blue", player_type : "human"},
                {player_name : "Player 2", player_color : "green", player_type : "human"}
            ]
        }
    ])
})

app.get('/game/play', async (req, res) => {
    const game_id = req.query.game_id
    const rolls = req.query.rolls

    // TODO: insert progression logic

    res.status(200);
})

async function getDetails(token) {
    const link = github_api_user;
    const requestOptions = {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
    };

    const response = await fetch(link, requestOptions);
    const details = await response.json();
    console.log(details)
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
