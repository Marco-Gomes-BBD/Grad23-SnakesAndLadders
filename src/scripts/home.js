<<<<<<< HEAD
const newgame = () => {
    window.location.assign('/player-select');
};

document.getElementById('new-game-btn').addEventListener('click', () => {
    newgame();
});
=======
document.getElementById('new-game-btn').addEventListener('click', () => {
    window.location.assign('/player-select')
})

document.getElementById('load-game-btn').addEventListener('click', () => {
    window.location.assign('/load-game')
})
>>>>>>> f3b2d30 (hold this)
