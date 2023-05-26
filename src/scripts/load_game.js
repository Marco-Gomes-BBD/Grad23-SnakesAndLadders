import { GameSummary } from './game-summary.js';

if (document.cookie != null) {
    fetch('/game/playing?' + document.cookie)
        .then((response) => response.json())
        .then((details) => {
            const container = document.getElementById('game-select');
            console.log(container);
            details.forEach((element) => {
                console.log(element);
                let new_child = new GameSummary(element);
                container.appendChild(new_child);
            });
        });
}
