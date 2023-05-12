
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

// sendFile will go here
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'html/pages/home_page.html'));
});

app.get('/game', function(req, res) {
    res.sendFile(path.join(__dirname, 'html/pages/game_page.html'));
});


app.listen(port);
console.log('Server started at http://localhost:' + port);