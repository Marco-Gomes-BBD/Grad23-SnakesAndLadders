import { load_section } from './loader.js';

const newgame = () => {
    window.location.assign('/player-select');
};

document.getElementById('new-game-btn').addEventListener('click', () => {
    newgame();
});
