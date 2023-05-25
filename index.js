require('dotenv-flow').config();
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

const github_api_authorize = 'https://github.com/login/oauth/authorize';
const github_api_access_token = 'https://github.com/login/oauth/access_token';
const github_api_user = 'https://api.github.com/user';

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

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
