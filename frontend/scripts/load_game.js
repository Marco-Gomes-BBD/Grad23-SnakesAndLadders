import { GameSummary } from './game-summary.js';

if (document.cookie != null) {
    let details = JSON.parse(localStorage.getItem('user-details'));
    fetch('/api/ongoing?user=' + details.id)
        .then((response) => response.json())
        .then((details) => {
            const container = document.getElementById('game-select');
            details.forEach((element) => {
                let new_child = new GameSummary(element);
                container.appendChild(new_child);
            });
        });
}
