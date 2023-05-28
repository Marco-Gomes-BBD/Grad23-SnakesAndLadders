document.getElementById('new-game-btn').addEventListener('click', () => {
    window.location.assign('/player-select');
});

document.getElementById('load-game-btn').addEventListener('click', () => {
    window.location.assign('/game/load');
});

const modal = document.getElementById('how-to-play-modal');
const closeBtn = modal.querySelector('.close');

function showInstructions() {
    modal.style.display = 'block';
}

function hideInstructions() {
    modal.style.display = 'none';
}

document
    .getElementById('how-to-play-btn')
    .addEventListener('click', function () {
        fetch('/pages/how_to_play.html')
            .then((response) => response.text())
            .then((data) => {
                document.getElementById('how-to-play-content').innerHTML = data;
                showInstructions();
            })
            .catch((error) => console.log(error));
    });

closeBtn.addEventListener('click', hideInstructions);
window.addEventListener('click', function (event) {
    if (event.target == modal) {
        hideInstructions();
    }
});
