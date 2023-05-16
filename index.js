
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.static("."))

app.get('/home', function(_req, res) {
<<<<<<< HEAD
    res.sendFile(path.join(__dirname, 'src/pages/home_page.html'));
});

app.get('/game', function(_req, res) {
    res.sendFile(path.join(__dirname, 'src/pages/game_page.html'));
});

app.get('/player-select', function(_req, res) {
    res.sendFile(path.join(__dirname, "src/pages/player_select.html"))
=======
    res.sendFile(path.join(__dirname, 'html/pages/home_page.html'));
});

app.get('/game', function(_req, res) {
    res.sendFile(path.join(__dirname, 'html/pages/game_page.html'));
});

app.get('/player-select', function(_req, res) {
    res.sendFile(path.join(__dirname, "html/pages/player_select.html"))
>>>>>>> develop
});

app.listen(port, () => {
    console.log('Server started at http://localhost:' + port);
});
