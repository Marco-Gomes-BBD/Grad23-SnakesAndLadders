import { load_section } from "./navigation.js"


const newgame = () => {
    window.location.assign("/player-select");
}


document.getElementById('new-game-btn').addEventListener('click', () => {
    newgame();
})
